import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User as UserIcon,
  MessageCircle,
  Heart,
  Share2,
  Trash2,
  MoreVertical,
  AlertTriangle,
  Phone,
  Copy,
  CheckCircle2,
  XCircle,
  Tag,
  Boxes,
  Repeat,
  Building2,
  X,
} from "lucide-react";
import { Item } from "../types";
import { useAuth } from "../hooks/useAuth";
import { itemAPI, wishlistAPI, messageAPI } from "../services/apiService";
import { mockCategories, mockLocations } from "../lib/mockData";

// ---------- helpers ----------
const getNormalizedId = (u: any): string | null => {
  const raw = u?.id ?? u?.userId ?? u?.user_id ?? null;
  return raw !== null && raw !== undefined ? String(raw) : null;
};

const statusStyle: Record<
  string,
  { bg: string; text: string; ring: string; label: string }
> = {
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    ring: "ring-yellow-200",
    label: "Pending",
  },
  accepted: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
    label: "Accepted",
  },
  rejected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
    label: "Rejected",
  },
  completed: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    label: "Completed",
  },
};

const safeDate = (iso?: string) => {
  try {
    return new Date(iso ?? "").toLocaleString();
  } catch {
    return "";
  }
};

const resolveCategoryName = (item: any) => {
  const id = Number(
    item?.categoryId ?? item?.category_id ?? item?.category?.id
  );
  if (!id) return item?.category?.name ?? "Uncategorized";
  return (
    mockCategories.find((c) => Number(c.id) === id)?.name ?? "Uncategorized"
  );
};

const resolveLocationName = (item: any) => {
  const loc =
    item?.location?.locationName ??
    item?.location?.name ??
    mockLocations.find(
      (l) => Number(l.id) === Number(item?.locationId ?? item?.location_id)
    )?.name;
  return loc ?? "Unknown location";
};

const getImages = (item: any): string[] => {
  // prefer array already parsed
  if (Array.isArray(item?.images) && item.images.length)
    return item.images.map(addImagePrefix);
  // try CSV in post.imageUrls
  const csv = item?.post?.imageUrls ?? item?.imageUrls;
  if (typeof csv === "string" && csv.trim()) {
    return csv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(addImagePrefix);
  }
  return [];
};

// Helper function to add the proper URL prefix for images
const addImagePrefix = (imagePath: string): string => {
  if (!imagePath) return "";
  // If it's already a full URL, return as-is
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("/api/")
  ) {
    return imagePath;
  }
  // Otherwise, prepend the backend URL
  return `http://localhost:8080/api/uploads/files/${imagePath}`;
};

export function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistNote, setWishlistNote] = useState("");
  const [message, setMessage] = useState("");
  const [statusActionOpen, setStatusActionOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<
    "pending" | "accepted" | "rejected" | "completed" | ""
  >("");
  const [statusNote, setStatusNote] = useState("");
  const [copied, setCopied] = useState(false);

  // Swap functionality state
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [userItems, setUserItems] = useState<any[]>([]);
  const [selectedSwapItem, setSelectedSwapItem] = useState<string>("");
  const [swapLoading, setSwapLoading] = useState(false);

  // gallery state
  const imgs = useMemo(() => getImages(item), [item]);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    setActiveImgIdx(0);
  }, [imgs.length]);

  // -------- fetch --------
  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const fetchedItem = await itemAPI.getItemById(parseInt(id));
        setItem(fetchedItem);

        if (user) {
          try {
            const wishlistItems = await wishlistAPI.getUserWishlists(
              parseInt(user.userId.toString())
            );
            const exists = wishlistItems.some(
              (w: any) =>
                Number(w.item?.id ?? w.itemId) ===
                Number(fetchedItem.id ?? fetchedItem.itemId)
            );
            setIsWishlisted(exists);
          } catch {
            /* ignore */
          }
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load item");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, user]);

  // -------- actions --------
  const handleAddToWishlist = async () => {
    if (!user || !item) return;
    await wishlistAPI.addToWishlist(
      user.userId,
      Number(item.id ?? item.itemId),
      wishlistNote
    );
    setIsWishlisted(true);
    setWishlistNote("");
  };

  const handleRemoveFromWishlist = async () => {
    if (!user || !item) return;
    await wishlistAPI.removeFromWishlist(
      user.userId,
      Number(item.id ?? item.itemId)
    );
    setIsWishlisted(false);
  };

  const handleSendMessage = async () => {
    if (!user || !item || !message.trim()) return;
    const receiverStr =
      getNormalizedId(item.post?.user) ?? getNormalizedId(item.user);
    const receiverId = receiverStr ? parseInt(receiverStr) : 0;
    await messageAPI.sendMessage({
      senderId: user.userId,
      receiverId,
      text: message.trim(),
      itemId: Number(item.itemId ?? item.id),
    });
    setMessage("");
    navigate("/messages");
  };

  // Fetch user's items for swapping
  const fetchUserItems = async () => {
    if (!user) return;
    try {
      setSwapLoading(true);
      const items = await itemAPI.getUserItems(user.userId);
      setUserItems(
        items.filter(
          (userItem: any) =>
            userItem.id !== item?.id && userItem.itemId !== item?.itemId
        )
      );
    } catch (error) {
      console.error("Error fetching user items:", error);
    } finally {
      setSwapLoading(false);
    }
  };

  const handleSwapRequest = async () => {
    if (!user || !item || !selectedSwapItem) return;
    try {
      // Send a message about the swap request
      const receiverStr =
        getNormalizedId(item.post?.user) ?? getNormalizedId(item.user);
      const receiverId = receiverStr ? parseInt(receiverStr) : 0;
      const swapItemData = userItems.find(
        (userItem) =>
          userItem.id === selectedSwapItem ||
          userItem.itemId === selectedSwapItem
      );
      const swapMessage = `Hi! I'd like to swap my "${
        swapItemData?.itemName || swapItemData?.title
      }" for your "${
        item.itemName || item.title
      }". Let me know if you're interested!`;

      await messageAPI.sendMessage({
        senderId: user.userId,
        receiverId,
        text: swapMessage,
        itemId: Number(item.itemId ?? item.id),
      });

      setShowSwapModal(false);
      setSelectedSwapItem("");
      alert("Swap request sent successfully!");
    } catch (error) {
      console.error("Error sending swap request:", error);
      alert("Failed to send swap request. Please try again.");
    }
  };

  const isOwner =
    Number(user?.userId) ===
    Number(
      getNormalizedId(item?.post?.user) ??
        getNormalizedId(item?.user) ??
        (item as any)?.user?.id
    );

  const handleDeleteItem = async () => {
    if (!item) return;
    await itemAPI.deleteItem(Number(item.id ?? (item as any)?.itemId));
    navigate("/browse");
  };

  const handleStatusUpdate = async () => {
    if (!item || !newStatus || !statusNote.trim()) return;
    await itemAPI.updateItem(Number(item.id ?? (item as any)?.itemId), {
      status: newStatus,
      statusNote: statusNote.trim(),
    });
    setNewStatus("");
    setStatusNote("");
    setStatusActionOpen(false);
    const refreshed = await itemAPI.getItemById(
      Number(item.id ?? (item as any)?.itemId)
    );
    setItem(refreshed);
  };

  // -------- derived display fields --------
  const display = useMemo(() => {
    const i: any = item ?? {};
    return {
      title: i.title ?? i.itemName ?? "Untitled item",
      description: i.description ?? "",
      category: resolveCategoryName(i),
      condition: i.itemCondition ?? i.condition ?? "—",
      type: (i.itemType ?? i.type ?? "").toString().toLowerCase(),
      swapWith: i.swapWith ?? i.swap_with ?? "",
      department: i.department ?? i.post?.department ?? "",
      phone: i.phone ?? i.post?.user?.phone ?? "",
      locationName: resolveLocationName(i),
      postedAt:
        safeDate(i.post?.postTime) ||
        safeDate(i.postTime) ||
        safeDate(i.created_at) ||
        safeDate(i.postDate),
      status: (i.status ?? "").toString().toLowerCase(),
      ownerUsername:
        i.post?.user?.username ?? i.user?.username ?? "Unknown user",
      ownerId: getNormalizedId(i.post?.user) ?? getNormalizedId(i.user) ?? "",
      id: i.id ?? i.itemId,
    };
  }, [item]);

  const shareUrl = useMemo(() => {
    if (!display.id) return window.location.href;
    return `${window.location.origin}/item/${display.id}`;
  }, [display.id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  const statusKey = (display.status || "") as
    | "pending"
    | "accepted"
    | "rejected"
    | "completed"
    | "";

  // -------- UI --------
  if (loading) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="max-w-6xl mx-auto p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-96 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="space-y-4">
              <div className="h-10 w-2/3 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-6 w-1/2 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-24 w-full bg-slate-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <div className="max-w-5xl mx-auto p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="mt-10 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 mt-0.5" />
            <div>
              <div className="font-semibold">Something went wrong</div>
              <div className="text-rose-600/80">
                {error ?? "Item not found"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] bg-[radial-gradient(1200px_600px_at_50%_-10%,#e0f2fe_0%,transparent_50%),radial-gradient(800px_400px_at_100%_0,#fce7f3_0%,transparent_45%)]">
      <div className="max-w-6xl mx-auto p-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-slate-700 hover:text-slate-900"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white/80 backdrop-blur-sm group-hover:shadow transition">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">Back</span>
          </button>

          {statusKey && (
            <span
              className={[
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ring-1",
                statusStyle[statusKey]?.bg ?? "bg-slate-50",
                statusStyle[statusKey]?.text ?? "text-slate-700",
                statusStyle[statusKey]?.ring ?? "ring-slate-200",
              ].join(" ")}
            >
              <span className="h-2 w-2 rounded-full bg-current opacity-60" />
              {statusStyle[statusKey]?.label ?? "Status"}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Gallery + Description */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card */}
            <div className="rounded-2xl bg-white/70 backdrop-blur shadow-sm ring-1 ring-slate-200 overflow-hidden">
              {/* Hero */}
              <div className="relative">
                {imgs.length ? (
                  <img
                    src={imgs[activeImgIdx] || imgs[0]}
                    alt={display.title}
                    className="w-full h-[420px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[420px] bg-slate-100 flex items-center justify-center text-slate-400">
                    No image
                  </div>
                )}
                {imgs.length ? (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="flex gap-2 bg-white/70 backdrop-blur rounded-full px-2 py-2 ring-1 ring-slate-200">
                      {imgs.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImgIdx(i)}
                          className={[
                            "h-12 w-12 rounded-full overflow-hidden ring-2 transition",
                            i === activeImgIdx
                              ? "ring-slate-900"
                              : "ring-transparent hover:ring-slate-300",
                          ].join(" ")}
                          title={`Image ${i + 1}`}
                        >
                          <img
                            src={img}
                            alt={`thumb ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Meta */}
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                      {display.title}
                    </h1>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                      <div className="inline-flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-slate-400" />
                        <span>{display.locationName}</span>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-slate-400" />
                        <span>Posted {display.postedAt || "—"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 bg-white hover:shadow-sm transition"
                      title="Copy link"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-sm">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="text-sm">Copy link</span>
                        </>
                      )}
                    </button>
                    <button
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 bg-white hover:shadow-sm transition"
                      title="Share"
                      onClick={() => {
                        if ((navigator as any).share) {
                          (navigator as any).share({
                            title: display.title,
                            url: shareUrl,
                          });
                        } else {
                          handleCopy();
                        }
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>

                {/* Owner */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    to={`/profile/${display.ownerId}`}
                    className="group inline-flex items-center gap-3 rounded-xl border px-3 py-2 bg-white hover:bg-slate-50 transition"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                      <UserIcon className="h-5 w-5 text-slate-500" />
                    </span>
                    <div className="leading-tight">
                      <div className="font-medium text-slate-900 group-hover:underline">
                        {display.ownerUsername}
                      </div>
                      <div className="text-xs text-slate-500">View profile</div>
                    </div>
                  </Link>

                  {(
                    Array.isArray(display.phone)
                      ? display.phone.length
                      : display.phone
                  ) ? (
                    <div className="inline-flex items-center gap-2 text-slate-600">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="truncate">
                        {Array.isArray(display.phone)
                          ? display.phone.join(" • ")
                          : display.phone}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Specs Card */}
            <div className="rounded-2xl bg-white/70 backdrop-blur shadow-sm ring-1 ring-slate-200 p-6 md:p-8">
              <h2 className="text-lg font-semibold text-slate-900">Details</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Spec
                  icon={<Tag className="h-5 w-5" />}
                  label="Category"
                  value={display.category}
                />
                <Spec
                  icon={<Boxes className="h-5 w-5" />}
                  label="Condition"
                  value={display.condition}
                />
                <Spec
                  icon={<Repeat className="h-5 w-5" />}
                  label="Type"
                  value={
                    display.type
                      ? display.type.charAt(0).toUpperCase() +
                        display.type.slice(1)
                      : "—"
                  }
                />
                {display.type === "swap" && (
                  <Spec
                    icon={<Repeat className="h-5 w-5" />}
                    label="Swap With"
                    value={display.swapWith || "—"}
                  />
                )}
                <Spec
                  icon={<Building2 className="h-5 w-5" />}
                  label="Department"
                  value={display.department || "—"}
                />
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-base font-medium text-slate-900">
                  Description
                </h3>
                <p className="mt-2 leading-7 text-slate-700">
                  {display.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Sticky Actions */}
          <AsideActions
            isOwner={isOwner}
            message={message}
            setMessage={setMessage}
            wishlistNote={wishlistNote}
            setWishlistNote={setWishlistNote}
            isWishlisted={isWishlisted}
            onSend={handleSendMessage}
            onAddRemoveWishlist={() =>
              isWishlisted ? handleRemoveFromWishlist() : handleAddToWishlist()
            }
            onDelete={handleDeleteItem}
            statusActionOpen={statusActionOpen}
            setStatusActionOpen={setStatusActionOpen}
            newStatus={newStatus}
            setNewStatus={setNewStatus}
            statusNote={statusNote}
            setStatusNote={setStatusNote}
            onUpdateStatus={handleStatusUpdate}
            // Swap props
            itemType={display.type}
            showSwapModal={showSwapModal}
            setShowSwapModal={setShowSwapModal}
            userItems={userItems}
            selectedSwapItem={selectedSwapItem}
            setSelectedSwapItem={setSelectedSwapItem}
            swapLoading={swapLoading}
            onFetchUserItems={fetchUserItems}
            onSwapRequest={handleSwapRequest}
          />
        </div>
      </div>
    </div>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 flex items-start gap-3">
      <div className="text-slate-500">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wide text-slate-500">
          {label}
        </div>
        <div className="text-slate-900 font-medium">{value || "—"}</div>
      </div>
    </div>
  );
}

function AsideActions(props: {
  isOwner: boolean;
  message: string;
  setMessage: (s: string) => void;
  wishlistNote: string;
  setWishlistNote: (s: string) => void;
  isWishlisted: boolean;
  onSend: () => void;
  onAddRemoveWishlist: () => void;
  onDelete: () => void;
  statusActionOpen: boolean;
  setStatusActionOpen: (b: boolean) => void;
  newStatus: "" | "pending" | "accepted" | "rejected" | "completed";
  setNewStatus: (v: any) => void;
  statusNote: string;
  setStatusNote: (s: string) => void;
  onUpdateStatus: () => void;
  // Swap props
  itemType?: string;
  showSwapModal: boolean;
  setShowSwapModal: (b: boolean) => void;
  userItems: any[];
  selectedSwapItem: string;
  setSelectedSwapItem: (s: string) => void;
  swapLoading: boolean;
  onFetchUserItems: () => void;
  onSwapRequest: () => void;
}) {
  const {
    isOwner,
    message,
    setMessage,
    wishlistNote,
    setWishlistNote,
    isWishlisted,
    onSend,
    onAddRemoveWishlist,
    onDelete,
    statusActionOpen,
    setStatusActionOpen,
    newStatus,
    setNewStatus,
    statusNote,
    setStatusNote,
    onUpdateStatus,
    // Swap props
    itemType,
    showSwapModal,
    setShowSwapModal,
    userItems,
    selectedSwapItem,
    setSelectedSwapItem,
    swapLoading,
    onFetchUserItems,
    onSwapRequest,
  } = props;

  return (
    <aside className="lg:col-span-4">
      <div className="lg:sticky lg:top-6 space-y-6">
        <div className="rounded-2xl bg-white/80 backdrop-blur shadow-sm ring-1 ring-slate-200 p-5">
          {!isOwner ? (
            <>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message…"
                    className="flex-1 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                  <button
                    onClick={onSend}
                    disabled={!message.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-y-[-1px] active:translate-y-0 transition"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Send
                  </button>
                </div>

                <div className="rounded-xl border p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-900">Wishlist</div>
                    <div className="text-xs text-slate-500">(private note)</div>
                  </div>
                  <textarea
                    value={wishlistNote}
                    onChange={(e) => setWishlistNote(e.target.value)}
                    placeholder="Why do you want this item?"
                    className="mt-2 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    rows={3}
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={onAddRemoveWishlist}
                      className={[
                        "inline-flex items-center gap-2 rounded-xl px-4 py-2 border transition",
                        isWishlisted
                          ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                          : "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
                      ].join(" ")}
                    >
                      <Heart className="h-5 w-5" />
                      {isWishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"}
                    </button>

                    {/* Swap button for swap-type items */}
                    {itemType === "swap" && (
                      <button
                        onClick={() => {
                          setShowSwapModal(true);
                          onFetchUserItems();
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition"
                      >
                        <Repeat className="h-5 w-5" />
                        Propose Swap
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <button
                  onClick={onDelete}
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-slate-50 transition"
                >
                  <Trash2 className="h-5 w-5 text-slate-700" /> Delete
                </button>

                <div className="relative">
                  <button
                    onClick={() => setStatusActionOpen(!statusActionOpen)}
                    className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-slate-50 transition"
                  >
                    <MoreVertical className="h-5 w-5 text-slate-700" /> Update
                    status
                  </button>

                  {statusActionOpen && (
                    <div className="absolute right-0 z-10 mt-2 w-72 bg-white border rounded-xl p-3 space-y-2 shadow-lg">
                      <label className="text-sm font-medium text-slate-700">
                        Status
                      </label>
                      <select
                        className="w-full border rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        value={newStatus}
                        onChange={(e) =>
                          setNewStatus(e.target.value as typeof newStatus)
                        }
                      >
                        <option value="">Select status</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                      </select>
                      <label className="text-sm font-medium text-slate-700">
                        Note
                      </label>
                      <textarea
                        className="w-full border rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                        placeholder="Status note…"
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        rows={3}
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={onUpdateStatus}
                          disabled={!newStatus || !statusNote.trim()}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-600 transition"
                        >
                          <CheckCircle2 className="h-5 w-5" /> Update
                        </button>
                        <button
                          onClick={() => setStatusActionOpen(false)}
                          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-slate-50 transition"
                        >
                          <XCircle className="h-5 w-5" /> Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Swap Modal */}
        {showSwapModal && (
          <div className="rounded-2xl bg-white/90 backdrop-blur shadow-sm ring-1 ring-slate-200 p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Choose Item to Swap
                </h3>
                <button
                  onClick={() => setShowSwapModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {swapLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Loading your items...
                </div>
              ) : userItems.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  You don't have any items available for swapping.
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Select an item to offer:
                    </label>
                    <select
                      value={selectedSwapItem}
                      onChange={(e) => setSelectedSwapItem(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose an item...</option>
                      {userItems.map((item) => (
                        <option
                          key={item.id || item.itemId}
                          value={item.id || item.itemId}
                        >
                          {item.itemName || item.title} (
                          {item.itemCondition || item.condition})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={onSwapRequest}
                      disabled={!selectedSwapItem}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Send Swap Request
                    </button>
                    <button
                      onClick={() => setShowSwapModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-white/60 backdrop-blur ring-1 ring-slate-200 p-4 text-sm text-slate-600">
          Be respectful. Avoid sharing sensitive info. Report issues if
          something looks off.
        </div>
      </div>
    </aside>
  );
}

export default ItemDetailPage;
