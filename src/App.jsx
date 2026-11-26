import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  MessageSquare,
  Users,
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Plus,
  X,
  Check,
  CheckCheck,
  AlertCircle,
  RefreshCw,
  Trash2,
  LogOut,
  ShieldCheck,
  ExternalLink,
  Copy,
  CheckCircle2,
  Wrench,
  Clock,
  Tag,
  FileText,
  Download,
} from 'lucide-react';

const STAFF_ACCOUNTS = [
  {
    username: 'admin',
    password: '123456',
    name: 'Nguyễn Nguyên Cường (Admin)',
    role: 'Quản trị viên',
  },
  {
    username: 'cskh1',
    password: '123456',
    name: 'Nhân viên CSKH 01',
    role: 'Tư vấn viên',
  },
  {
    username: 'cskh2',
    password: '123456',
    name: 'Nhân viên CSKH 02',
    role: 'Tư vấn viên',
  },
];

const INITIAL_FANPAGES = [];
const INITIAL_CONVERSATIONS = [];

const QUICK_REPLIES = [
  {
    shortcut: '/chao',
    title: 'Lời chào khách hàng',
    content:
      'Dạ chào Anh/Chị! Cảm ơn Anh/Chị đã nhắn tin cho Fanpage. Em có thể hỗ trợ thông tin gì cho mình hôm nay ạ? 😊',
  },
  {
    shortcut: '/baogia',
    title: 'Gửi bảng giá & ưu đãi',
    content:
      'Dạ em xin gửi Anh/Chị thông tin báo giá và chương trình ưu đãi hiện tại. Anh/Chị tham khảo giúp em nhé! ✨',
  },
  {
    shortcut: '/xin_sdt',
    title: 'Xin số điện thoại tư vấn',
    content:
      'Để hỗ trợ nhanh và chi tiết nhất, Anh/Chị cho em xin số điện thoại liên hệ của mình được không ạ? 📞',
  },
  {
    shortcut: '/camon',
    title: 'Lời cảm ơn',
    content:
      'Dạ em cảm ơn Anh/Chị nhiều ạ. Chúc Anh/Chị một ngày thật nhiều niềm vui! 💙',
  },
];

const EMOJI_LIST = [
  '😊', '😍', '🙏', '👍', '❤️', '😂', '🎉', '🔥',
  '✨', '💬', '📞', '🚗', '✅', '👌', '😄', '🥰',
];

const STORAGE_KEY = 'omnichat_fb_conversations_v3';
const FANPAGES_STORAGE_KEY = 'omnichat_fb_fanpages_v3';
const USER_STORAGE_KEY = 'omnichat_fb_logged_in_user_v3';

const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-purple-500 to-pink-600',
  'from-cyan-500 to-blue-600',
  'from-rose-500 to-red-600',
];

const FacebookBadge = ({ size = 'sm' }) => {
  const dim = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const iconDim = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';
  return (
    <span
      title="Facebook Messenger"
      className={`${dim} rounded-full bg-[#0084FF] text-white flex items-center justify-center ring-2 ring-white shadow-sm shrink-0`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconDim}>
        <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.913 1.454 5.512 3.726 7.21V22l3.405-1.869c.909.252 1.871.388 2.869.388 5.523 0 10-4.145 10-9.259S17.523 2 12 2zm1.008 12.463l-2.548-2.717-4.97 2.717 5.467-5.803 2.61 2.717 4.908-2.717-5.467 5.803z" />
      </svg>
    </span>
  );
};

const UserAvatar = ({ src, name, className = 'w-11 h-11' }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const initials = useMemo(() => {
    const clean = String(name || '').trim();
    if (!clean) return 'FB';
    const parts = clean.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  const colorClass = useMemo(() => {
    const str = String(name || 'FB');
    const sum = str.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
  }, [name]);

  const cleanSrc = typeof src === 'string' ? src.trim() : '';
  const canRenderImg = Boolean(cleanSrc) && !imgError && !cleanSrc.startsWith('blob:');

  if (canRenderImg) {
    return (
      <img
        src={cleanSrc}
        alt={name || 'Avatar'}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${className} rounded-full object-cover border border-slate-200 bg-slate-100 shrink-0`}
      />
    );
  }

  return (
    <div
      title={name || 'Khách Facebook'}
      className={`${className} rounded-full bg-gradient-to-br ${colorClass} text-white font-bold flex items-center justify-center border border-white shadow-2xs shrink-0 select-none text-xs`}
    >
      {initials}
    </div>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeNav, setActiveNav] = useState('messages'); // 'messages' | 'customers' | 'tools'
  const [fanpages, setFanpages] = useState(() => {
    try {
      const saved = localStorage.getItem(FANPAGES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_FANPAGES;
    } catch {
      return INITIAL_FANPAGES;
    }
  });

  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [selectedId, setSelectedId] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'unread'
  const [selectedPageFilter, setSelectedPageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [messageInput, setMessageInput] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [quickReplyFilter, setQuickReplyFilter] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState('');

  const [showRightPanel, setShowRightPanel] = useState(true);
  const [crmForm, setCrmForm] = useState({
    phone: '',
    email: '',
    leadStage: 'Mới',
    notes: '',
  });
  const [crmSavedToast, setCrmSavedToast] = useState(false);

  const [toastNotification, setToastNotification] = useState(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [isConnectingApi, setIsConnectingApi] = useState(false);
  const [discoveredPages, setDiscoveredPages] = useState([]);
  const [selectedDiscoverIds, setSelectedDiscoverIds] = useState([]);
  const [customUserToken, setCustomUserToken] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const processedIdsRef = useRef(new Set());
  const syncedTokenPagesRef = useRef(new Set());

  const triggerToast = (title, desc, isError = false) => {
    setToastNotification({ title, desc, isError });
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  // Lưu localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FANPAGES_STORAGE_KEY, JSON.stringify(fanpages));
    } catch (e) {}
  }, [fanpages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {}
  }, [conversations]);

  // Tự động đẩy lại Page Access Token đã lưu lên Redis để không phải kết nối lại nhiều lần
  useEffect(() => {
    if (!currentUser || fanpages.length === 0) return;
    const validPages = fanpages.filter(
      (fp) =>
        fp.connected &&
        fp.pageId &&
        fp.accessToken &&
        !syncedTokenPagesRef.current.has(`${fp.pageId}:${fp.accessToken}`)
    );
    if (validPages.length === 0) return;

    validPages.forEach((fp) =>
      syncedTokenPagesRef.current.add(`${fp.pageId}:${fp.accessToken}`)
    );

    fetch('/api/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register_pages',
        pages: validPages.map((fp) => ({
          pageId: fp.pageId,
          name: fp.name,
          accessToken: fp.accessToken,
        })),
      }),
    }).catch(() => {});
  }, [currentUser, fanpages]);

  // Nạp sẵn các ID tin nhắn đã có để không lặp lại khi tải lại trang
  useEffect(() => {
    conversations.forEach((conv) => {
      (conv.messages || []).forEach((m) => {
        if (m.id) processedIdsRef.current.add(m.id);
      });
    });
  }, []);

  // Tự động lấy tin nhắn thật từ Facebook Webhook mỗi 3 giây
  useEffect(() => {
    if (!currentUser) return;

    const pollFacebookMessages = async () => {
      try {
        const res = await fetch('/api/webhook?action=poll');
        const data = await res.json();
        if (!data.ok || !Array.isArray(data.events)) return;

        const fbEvents = data.events.filter(
          (ev) => (ev.platform || 'facebook') === 'facebook' && ev.direction !== 'outgoing'
        );

        const newEvents = fbEvents.filter((ev) => {
          if (!ev.id || processedIdsRef.current.has(ev.id)) return false;
          return true;
        });

        if (newEvents.length === 0) return;

        newEvents.reverse().forEach((ev) => {
          processedIdsRef.current.add(ev.id);

          const evPageId = String(ev.pageId || '');
          const evSenderPsid = String(ev.senderPsid || '');
          if (!evSenderPsid) return;

          const matchedPage = fanpages.find((f) => String(f.pageId) === evPageId);
          const channelName = matchedPage?.name || ev.pageName || 'Fanpage Facebook';

          const nowTime =
            new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            }) + ', Hôm nay';

          const incomingMsg = {
            id: ev.id,
            sender: 'customer',
            senderName: ev.senderName || `Khách Facebook (${evSenderPsid.slice(-4)})`,
            type: ev.type || 'text',
            text: ev.text || '',
            imageUrl: ev.imageUrl || '',
            videoUrl: ev.videoUrl || '',
            fileName: ev.fileName || '',
            fileUrl: ev.fileUrl || '',
            timestamp: nowTime,
          };

          const convId = `fb_${evPageId || 'page'}_${evSenderPsid}`;

          setConversations((prev) => {
            const idx = prev.findIndex(
              (c) =>
                c.platform === 'facebook' &&
                String(c.platformUserId) === evSenderPsid &&
                String(c.pageId || '') === evPageId
            );

            if (idx !== -1) {
              const updated = [...prev];
              const target = updated[idx];
              const existsMsg = (target.messages || []).some((m) => m.id === incomingMsg.id);
              if (existsMsg) return prev;

              updated.splice(idx, 1);
              return [
                {
                  ...target,
                  name: ev.senderName || target.name,
                  avatar: ev.senderAvatar || target.avatar,
                  pageId: evPageId || target.pageId || '',
                  channelName,
                  lastTime: 'Vừa xong',
                  unreadCount:
                    target.id === selectedId && activeNav === 'messages'
                      ? 0
                      : (target.unreadCount || 0) + 1,
                  messages: [...(target.messages || []), incomingMsg],
                },
                ...updated,
              ];
            }

            return [
              {
                id: convId,
                name: ev.senderName || `Khách Facebook (${evSenderPsid.slice(-4)})`,
                avatar: ev.senderAvatar || '',
                platform: 'facebook',
                pageId: evPageId,
                channelName,
                platformUserId: evSenderPsid,
                phone: 'Chưa cập nhật',
                email: '',
                leadStage: 'Mới',
                unreadCount: 1,
                lastTime: 'Vừa xong',
                tags: ['Facebook Messenger', channelName],
                notes: 'Khách nhắn tin thật từ Facebook Messenger.',
                messages: [incomingMsg],
              },
              ...prev,
            ];
          });

          if (!selectedId) {
            setSelectedId(convId);
          }

          triggerToast(
            `Tin nhắn mới từ ${ev.senderName || 'Khách Facebook'}`,
            ev.text || 'Đã gửi tệp/hình ảnh/video',
            false
          );
        });
      } catch (e) {}
    };

    pollFacebookMessages();
    const timer = setInterval(pollFacebookMessages, 3000);
    return () => clearInterval(timer);
  }, [currentUser, fanpages, selectedId, activeNav]);

  const activeConversation = useMemo(() => {
    return (
      conversations.find((c) => c.id === selectedId) || conversations[0] || null
    );
  }, [conversations, selectedId]);

  useEffect(() => {
    if (activeConversation) {
      setCrmForm({
        phone: activeConversation.phone || '',
        email: activeConversation.email || '',
        leadStage: activeConversation.leadStage || 'Mới',
        notes: activeConversation.notes || '',
      });
      setIsAddingTag(false);
      setNewTagText('');
    }
  }, [activeConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages?.length, selectedId]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      if (filterTab === 'unread' && (conv.unreadCount || 0) === 0) return false;
      if (selectedPageFilter !== 'all') {
        if (String(conv.pageId || '') !== String(selectedPageFilter)) return false;
      }
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const lastMsg = conv.messages?.[conv.messages.length - 1];
        return (
          (conv.name || '').toLowerCase().includes(q) ||
          (conv.phone || '').toLowerCase().includes(q) ||
          (lastMsg?.text || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [conversations, filterTab, selectedPageFilter, searchQuery]);

  const unreadTotalCount = useMemo(() => {
    return conversations.filter((c) => (c.unreadCount || 0) > 0).length;
  }, [conversations]);

  const handleStaffLogin = (e) => {
    e.preventDefault();
    const found = STAFF_ACCOUNTS.find(
      (acc) =>
        acc.username.toLowerCase() === loginUsername.trim().toLowerCase() &&
        acc.password === loginPassword
    );
    if (!found) {
      setLoginError('Tên đăng nhập hoặc mật khẩu không chính xác!');
      return;
    }
    setCurrentUser(found);
    setLoginError('');
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(found));
  };

  const handleStaffLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const handleSelectConversation = (id) => {
    setSelectedId(id);
    setActiveNav('messages');
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setMessageInput(val);
    if (val.startsWith('/')) {
      setShowQuickReplies(true);
      setQuickReplyFilter(val.toLowerCase());
    } else if (val.endsWith(' /')) {
      setShowQuickReplies(true);
      setQuickReplyFilter('/');
    } else if (!val.includes('/')) {
      setShowQuickReplies(false);
    }
  };

  const filteredQuickReplies = useMemo(() => {
    if (!quickReplyFilter || quickReplyFilter === '/') return QUICK_REPLIES;
    return QUICK_REPLIES.filter(
      (qr) =>
        qr.shortcut.toLowerCase().includes(quickReplyFilter) ||
        qr.title.toLowerCase().includes(quickReplyFilter.replace('/', ''))
    );
  }, [quickReplyFilter]);

  const updateMessageStatus = (convId, msgId, status, errorReason = '') => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        return {
          ...c,
          messages: (c.messages || []).map((m) =>
            m.id === msgId ? { ...m, deliveryStatus: status, errorReason } : m
          ),
        };
      })
    );
  };

  const handleSendMessage = async (customPayload = null) => {
    if (!activeConversation) return;
    const textToSend = customPayload ? customPayload.text : messageInput.trim();
    if (!textToSend && !customPayload?.imageUrl && !customPayload?.videoUrl) return;

    const targetConv = activeConversation;
    const msgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5);
    const nowTime =
      new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }) + ', Hôm nay';

    const newMsg = {
      id: msgId,
      sender: 'agent',
      agentName: currentUser?.name || 'Quản trị viên',
      type: customPayload?.type || 'text',
      text: textToSend || '',
      imageUrl: customPayload?.imageUrl || '',
      videoUrl: customPayload?.videoUrl || '',
      fileName: customPayload?.fileName || '',
      fileUrl: customPayload?.fileUrl || '',
      timestamp: nowTime,
      deliveryStatus: 'sending', // 'sending' | 'sent' | 'failed'
      errorReason: '',
    };

    processedIdsRef.current.add(msgId);

    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === targetConv.id);
      if (idx === -1) return prev;
      const updated = [...prev];
      const current = updated[idx];
      updated.splice(idx, 1);
      return [
        {
          ...current,
          unreadCount: 0,
          lastTime: 'Vừa xong',
          messages: [...(current.messages || []), newMsg],
        },
        ...updated,
      ];
    });

    if (!customPayload) {
      setMessageInput('');
      setShowQuickReplies(false);
      setShowEmojiPicker(false);
    }

    const matchedPage = fanpages.find(
      (f) =>
        String(f.pageId) === String(targetConv.pageId) ||
        f.name === targetConv.channelName
    );

    const payloadText =
      textToSend ||
      (customPayload?.type === 'image'
        ? `[Đã gửi hình ảnh: ${customPayload.imageUrl || 'ảnh đính kèm'}]`
        : customPayload?.type === 'video'
        ? `[Đã gửi video: ${customPayload.videoUrl || 'video đính kèm'}]`
        : '');

    try {
      const res = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_reply',
          pageId: matchedPage?.pageId || targetConv.pageId,
          pageAccessToken: matchedPage?.accessToken || '',
          recipientPsid: String(targetConv.platformUserId),
          text: payloadText,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.ok) {
        updateMessageStatus(targetConv.id, msgId, 'sent', '');
      } else {
        const reason = resData.error || 'Facebook từ chối gửi tin nhắn.';
        updateMessageStatus(targetConv.id, msgId, 'failed', reason);
        triggerToast('Chưa gửi được tin nhắn', reason, true);
      }
    } catch (err) {
      const reason = err.message || 'Lỗi kết nối máy chủ.';
      updateMessageStatus(targetConv.id, msgId, 'failed', reason);
      triggerToast('Chưa gửi được tin nhắn', reason, true);
    }
  };

  const handleImageFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleSendMessage({
        type: 'image',
        text: messageInput.trim() || `[Hình ảnh: ${file.name}]`,
        imageUrl: String(reader.result || ''),
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleVideoFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    handleSendMessage({
      type: 'video',
      text: messageInput.trim() || `[Video: ${file.name}]`,
      videoUrl: objectUrl,
      fileName: file.name,
    });
    e.target.value = '';
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmed = newTagText.trim();
    if (!trimmed || !activeConversation) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConversation.id) return c;
        const currentTags = c.tags || [];
        if (currentTags.includes(trimmed)) return c;
        return { ...c, tags: [...currentTags, trimmed] };
      })
    );
    setNewTagText('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, tags: (c.tags || []).filter((t) => t !== tagToRemove) }
          : c
      )
    );
  };

  const handleSaveCrm = () => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              phone: crmForm.phone,
              email: crmForm.email,
              leadStage: crmForm.leadStage,
              notes: crmForm.notes,
            }
          : c
      )
    );
    setCrmSavedToast(true);
    setTimeout(() => setCrmSavedToast(false), 2000);
  };

  const handleClearOldMessages = async () => {
    try {
      await fetch('/api/webhook?action=clear_events');
    } catch (e) {}
    processedIdsRef.current.clear();
    setConversations([]);
    setSelectedId('');
    localStorage.removeItem(STORAGE_KEY);
    triggerToast('Đã dọn sạch tin nhắn cũ', 'Hộp thư và bộ nhớ tạm đã được làm mới.', false);
  };

  // Kết nối Facebook cá nhân & quét Fanpage
  const fetchPagesFromFacebookToken = (token) => {
    fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,username,category,picture,access_token&access_token=${encodeURIComponent(
        token
      )}`
    )
      .then((r) => r.json())
      .then((data) => {
        setIsConnectingApi(false);
        if (data.error) {
          triggerToast('Lỗi từ Facebook', data.error.message || 'Không lấy được danh sách Fanpage.', true);
          return;
        }
        const list = (data.data || []).map((p) => ({
          pageId: String(p.id),
          name: p.name,
          username: p.username ? `@${p.username}` : `@${p.id}`,
          category: p.category || 'Fanpage Facebook',
          avatar: p.picture?.data?.url || '',
          accessToken: p.access_token,
        }));
        setDiscoveredPages(list);
        setSelectedDiscoverIds(list.map((x) => x.pageId));
      })
      .catch((err) => {
        setIsConnectingApi(false);
        triggerToast('Lỗi kết nối Facebook', err.message, true);
      });
  };

  const handleStartFbLogin = () => {
    setIsConnectingApi(true);
    if (customUserToken.trim()) {
      fetchPagesFromFacebookToken(customUserToken.trim());
      return;
    }

    if (!window.FB) {
      setIsConnectingApi(false);
      triggerToast('Chưa tải được Facebook SDK', 'Hãy tải lại trang hoặc tắt trình chặn quảng cáo.', true);
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse?.accessToken) {
          fetchPagesFromFacebookToken(response.authResponse.accessToken);
        } else {
          setIsConnectingApi(false);
          triggerToast('Chưa hoàn tất đăng nhập Facebook', 'Bạn cần bấm Tiếp tục để lấy danh sách Fanpage.', true);
        }
      },
      { scope: 'pages_show_list,pages_messaging,pages_manage_metadata,pages_read_engagement' }
    );
  };

  const handleSaveSelectedPages = async () => {
    const chosen = discoveredPages.filter((p) => selectedDiscoverIds.includes(p.pageId));
    if (chosen.length === 0) return;

    setIsConnectingApi(true);
    const formatted = chosen.map((p) => ({
      id: 'page_' + p.pageId,
      pageId: p.pageId,
      name: p.name,
      username: p.username,
      avatar: p.avatar || '',
      accessToken: p.accessToken,
      connected: true,
      updatedAt: 'Vừa xong',
    }));

    setFanpages((prev) => {
      const next = [...prev];
      formatted.forEach((fp) => {
        const idx = next.findIndex((item) => String(item.pageId) === String(fp.pageId));
        if (idx !== -1) {
          next[idx] = { ...next[idx], ...fp };
        } else {
          next.unshift(fp);
        }
      });
      return next;
    });

    try {
      await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register_pages',
          pages: formatted.map((p) => ({
            pageId: p.pageId,
            name: p.name,
            accessToken: p.accessToken,
          })),
        }),
      });
    } catch (e) {}

    setIsConnectingApi(false);
    setConnectModalOpen(false);
    triggerToast(
      `Đã lưu ${formatted.length} Fanpage`,
      'Đã lưu Token tự động — các lần sau không cần đăng nhập lại khi chỉ nhắn tin.',
      false
    );
  };

  const handleRemoveFanpage = (pageId) => {
    setFanpages((prev) => prev.filter((fp) => String(fp.pageId) !== String(pageId)));
    if (String(selectedPageFilter) === String(pageId)) {
      setSelectedPageFilter('all');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F294A] via-[#153864] to-[#0B1E38] flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
          <div className="p-7 pb-5 text-center border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-[#0F294A] text-white flex items-center justify-center mx-auto shadow-md mb-3">
              <MessageSquare className="w-6 h-6 text-sky-400" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Omni<span className="text-[#0084FF]">Chat</span> Facebook
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Đăng nhập hệ thống quản lý tin nhắn Fanpage
            </p>
          </div>

          <form onSubmit={handleStaffLogin} className="p-7 space-y-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Ví dụ: admin"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0084FF]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0084FF]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#0084FF] hover:bg-[#006FD6] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Đăng nhập vào hệ thống
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100 text-slate-800 font-sans select-none">
      {/* Thanh điều hướng trên cùng */}
      <header className="h-12 bg-[#0F294A] text-white flex items-center justify-between px-3 shrink-0 z-30">
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-2 pr-3 mr-1 border-r border-white/15">
            <div className="w-7 h-7 rounded-lg bg-[#0084FF] flex items-center justify-center font-bold text-xs">
              FB
            </div>
            <span className="font-bold text-sm tracking-tight">OmniChat</span>
          </div>

          <button
            onClick={() => setActiveNav('messages')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
              activeNav === 'messages'
                ? 'bg-[#0084FF] text-white'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Tin nhắn</span>
            {unreadTotalCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {unreadTotalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveNav('customers')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
              activeNav === 'customers'
                ? 'bg-[#0084FF] text-white'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Khách hàng ({conversations.length})</span>
          </button>

          <button
            onClick={() => setActiveNav('tools')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 cursor-pointer ${
              activeNav === 'tools'
                ? 'bg-[#0084FF] text-white'
                : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Fanpage & Kết nối ({fanpages.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearOldMessages}
            className="px-2.5 py-1 rounded bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-medium flex items-center space-x-1 cursor-pointer"
            title="Xóa toàn bộ tin nhắn cũ trên màn hình và bộ nhớ tạm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Dọn tin cũ</span>
          </button>

          <div className="hidden md:flex items-center space-x-1.5 pl-2 border-l border-white/15 text-xs">
            <span className="font-medium text-slate-100">{currentUser.name}</span>
            <button
              onClick={handleStaffLogout}
              className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Thông báo nổi */}
      {toastNotification && (
        <div
          className={`fixed top-14 right-4 z-50 max-w-sm rounded-xl shadow-xl border p-3.5 flex items-start space-x-3 bg-white ${
            toastNotification.isError ? 'border-rose-300' : 'border-sky-200'
          }`}
        >
          {toastNotification.isError ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#0084FF] shrink-0 mt-0.5" />
          )}
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900">
              {toastNotification.title}
            </div>
            <div className="text-xs text-slate-600 mt-0.5 break-words">
              {toastNotification.desc}
            </div>
          </div>
        </div>
      )}

      {/* Nội dung chính */}
      {activeNav === 'messages' && (
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Cột 1: Danh sách hội thoại Facebook */}
          <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">
                  Messenger ({filteredConversations.length})
                </span>
                <button
                  onClick={() => setActiveNav('tools')}
                  className="text-[11px] text-[#0084FF] hover:underline font-medium cursor-pointer"
                >
                  + Thêm Fanpage
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tên khách, SĐT hoặc tin nhắn..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0084FF]"
                />
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`flex-1 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    filterTab === 'all'
                      ? 'bg-[#0084FF] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilterTab('unread')}
                  className={`flex-1 py-1 rounded-md text-xs font-medium cursor-pointer ${
                    filterTab === 'unread'
                      ? 'bg-[#0084FF] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Chưa trả lời ({unreadTotalCount})
                </button>
              </div>

              {fanpages.length > 0 && (
                <select
                  value={selectedPageFilter}
                  onChange={(e) => setSelectedPageFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700"
                >
                  <option value="all">Tất cả Fanpage ({fanpages.length})</option>
                  {fanpages.map((fp) => (
                    <option key={fp.pageId} value={fp.pageId}>
                      {fp.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                  <p>Chưa có tin nhắn nào từ Facebook.</p>
                  <p className="text-[11px]">
                    Hãy kết nối Fanpage ở mục <strong>Fanpage & Kết nối</strong> rồi thử nhắn tin vào Messenger.
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const lastMsg = conv.messages?.[conv.messages.length - 1];
                  const preview =
                    lastMsg?.type === 'image'
                      ? '🖼️ Hình ảnh'
                      : lastMsg?.type === 'video'
                      ? '🎥 Video'
                      : lastMsg?.sender === 'agent'
                      ? `Bạn: ${lastMsg?.text || ''}`
                      : lastMsg?.text || '';
                  const isSelected = activeConversation?.id === conv.id;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`p-3 flex items-start space-x-3 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#EBF5FF]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <UserAvatar
                          src={conv.avatar}
                          name={conv.name}
                          className="w-11 h-11"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5">
                          <FacebookBadge size="sm" />
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {conv.name}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {conv.lastTime || ''}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 truncate mt-0.5">
                          {preview}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-[#0084FF] font-medium truncate">
                            {conv.channelName}
                          </span>
                          {(conv.unreadCount || 0) > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-[#0084FF] text-white text-[10px] font-bold">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* Cột 2: Khung chat giữa */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#F4F6F9]">
            {activeConversation ? (
              <>
                <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative shrink-0">
                      <UserAvatar
                        src={activeConversation.avatar}
                        name={activeConversation.name}
                        className="w-10 h-10"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5">
                        <FacebookBadge size="sm" />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {activeConversation.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        Fanpage: <strong>{activeConversation.channelName}</strong> • PSID:{' '}
                        {activeConversation.platformUserId}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowRightPanel((v) => !v)}
                    className="px-2.5 py-1 rounded-md border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    {showRightPanel ? 'Ẩn thông tin' : 'Hiện thông tin'}
                  </button>
                </div>

                {/* Nhãn khách hàng */}
                <div className="bg-white/90 border-b border-slate-200 px-4 py-1.5 flex items-center flex-wrap gap-1.5 shrink-0">
                  {(activeConversation.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-sky-50 text-[#0084FF] border border-sky-200 text-[11px] font-medium"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {isAddingTag ? (
                    <form onSubmit={handleAddTag} className="inline-flex items-center space-x-1">
                      <input
                        type="text"
                        value={newTagText}
                        onChange={(e) => setNewTagText(e.target.value)}
                        placeholder="Tên nhãn..."
                        className="px-2 py-0.5 text-xs border border-sky-300 rounded-full focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-2 py-0.5 rounded-full bg-[#0084FF] text-white text-[11px] cursor-pointer"
                      >
                        Lưu
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsAddingTag(true)}
                      className="text-[11px] text-slate-500 hover:text-[#0084FF] px-2 py-0.5 rounded-full border border-dashed border-slate-300 cursor-pointer"
                    >
                      + Thêm nhãn
                    </button>
                  )}
                </div>

                {/* Danh sách tin nhắn */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {(activeConversation.messages || []).map((msg) => {
                    const isAgent = msg.sender === 'agent';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isAgent ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div className="text-[10px] text-slate-400 mb-1 px-1">
                          {isAgent
                            ? `${msg.agentName || currentUser.name} • ${msg.timestamp || ''}`
                            : `${msg.senderName || activeConversation.name} • ${msg.timestamp || ''}`}
                        </div>

                        <div
                          className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm shadow-2xs space-y-2 ${
                            isAgent
                              ? 'bg-[#0084FF] text-white rounded-br-sm'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                          }`}
                        >
                          {msg.type === 'image' && msg.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              alt={msg.fileName || 'Hình ảnh'}
                              referrerPolicy="no-referrer"
                              className="max-h-64 rounded-xl object-contain bg-slate-900/5"
                            />
                          )}

                          {msg.type === 'video' && msg.videoUrl && (
                            <video
                              src={msg.videoUrl}
                              controls
                              className="max-h-64 rounded-xl bg-black"
                            />
                          )}

                          {msg.type === 'file' && msg.fileUrl && (
                            <a
                              href={msg.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1.5 underline text-xs"
                            >
                              <FileText className="w-4 h-4 shrink-0" />
                              <span>{msg.fileName || 'Tải tệp đính kèm'}</span>
                            </a>
                          )}

                          {msg.text && (
                            <div className="whitespace-pre-wrap break-words leading-relaxed">
                              {msg.text}
                            </div>
                          )}
                        </div>

                        {/* Trạng thái gửi đi của Admin */}
                        {isAgent && (
                          <div className="mt-1 px-1 flex items-center space-x-1 text-[11px]">
                            {msg.deliveryStatus === 'sending' && (
                              <span className="inline-flex items-center space-x-1 text-slate-500">
                                <Clock className="w-3 h-3 animate-spin" />
                                <span>Đang gửi...</span>
                              </span>
                            )}
                            {msg.deliveryStatus === 'sent' && (
                              <span className="inline-flex items-center space-x-1 text-emerald-600 font-medium">
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>Đã gửi</span>
                              </span>
                            )}
                            {msg.deliveryStatus === 'failed' && (
                              <span
                                className="inline-flex items-center space-x-1 text-rose-600 font-semibold"
                                title={msg.errorReason || 'Không gửi được'}
                              >
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>
                                  Chưa gửi được ({msg.errorReason || 'Lỗi kết nối'})
                                </span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Khung soạn tin nhắn */}
                <div className="bg-white border-t border-slate-200 p-3 relative shrink-0">
                  {showQuickReplies && (
                    <div className="mb-2 bg-white border border-slate-200 rounded-xl shadow-lg p-2 max-h-44 overflow-y-auto">
                      <div className="text-[11px] font-bold text-slate-500 px-2 py-1">
                        Tin nhắn mẫu nhanh (gõ / để mở)
                      </div>
                      {filteredQuickReplies.map((qr) => (
                        <button
                          key={qr.shortcut}
                          type="button"
                          onClick={() => {
                            setMessageInput(qr.content);
                            setShowQuickReplies(false);
                            inputRef.current?.focus();
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-sky-50 text-xs cursor-pointer"
                        >
                          <span className="font-bold text-[#0084FF]">{qr.shortcut}</span>{' '}
                          <span className="font-medium text-slate-800">— {qr.title}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {showEmojiPicker && (
                    <div className="mb-2 bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 flex flex-wrap gap-1.5">
                      {EMOJI_LIST.map((emo) => (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => {
                            setMessageInput((prev) => prev + emo);
                            inputRef.current?.focus();
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-slate-100 text-lg flex items-center justify-center cursor-pointer"
                        >
                          {emo}
                        </button>
                      ))}
                    </div>
                  )}

                  <textarea
                    ref={inputRef}
                    rows={2}
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Nhập tin nhắn trả lời khách (nhấn Enter để gửi, Shift+Enter xuống dòng, gõ / để dùng mẫu)..."
                    className="w-full text-sm resize-none focus:outline-none text-slate-800"
                  />

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker((v) => !v)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                        title="Chèn icon / emoji"
                      >
                        <Smile className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                        title="Gửi hình ảnh"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => mediaInputRef.current?.click()}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                        title="Gửi video"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileSelected}
                        className="hidden"
                      />
                      <input
                        ref={mediaInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileSelected}
                        className="hidden"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      className="px-4 py-1.5 rounded-lg bg-[#0084FF] hover:bg-[#006FD6] text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Gửi</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                Chọn một cuộc trò chuyện bên trái để bắt đầu nhắn tin.
              </div>
            )}
          </main>

          {/* Cột 3: Hồ sơ khách hàng */}
          {showRightPanel && activeConversation && (
            <aside className="hidden lg:flex w-72 bg-white border-l border-slate-200 flex-col shrink-0 p-4 space-y-4 overflow-y-auto text-xs">
              <div className="text-center pb-3 border-b border-slate-100">
                <UserAvatar
                  src={activeConversation.avatar}
                  name={activeConversation.name}
                  className="w-16 h-16 mx-auto"
                />
                <div className="font-bold text-sm text-slate-900 mt-2">
                  {activeConversation.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {activeConversation.channelName}
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Giai đoạn khách hàng
                  </label>
                  <select
                    value={crmForm.leadStage}
                    onChange={(e) =>
                      setCrmForm((prev) => ({ ...prev, leadStage: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                  >
                    <option value="Mới">Mới (New Lead)</option>
                    <option value="Đang tư vấn">Đang tư vấn</option>
                    <option value="Đã chốt">Đã chốt</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={crmForm.phone}
                    onChange={(e) =>
                      setCrmForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="Nhập SĐT khách..."
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    rows={3}
                    value={crmForm.notes}
                    onChange={(e) =>
                      setCrmForm((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    placeholder="Ghi chú chăm sóc..."
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Platform User ID (PSID)</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-[11px] text-slate-800 truncate">
                      {activeConversation.platformUserId}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(String(activeConversation.platformUserId));
                        setCopiedId(true);
                        setTimeout(() => setCopiedId(false), 1500);
                      }}
                      className="text-[#0084FF] font-semibold ml-2 cursor-pointer"
                    >
                      {copiedId ? 'Đã chép' : 'Copy'}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveCrm}
                  className="w-full py-2 rounded-lg bg-[#0F294A] hover:bg-[#173B69] text-white font-semibold cursor-pointer"
                >
                  {crmSavedToast ? '✓ Đã lưu thông tin' : 'Lưu thông tin khách'}
                </button>
              </div>
            </aside>
          )}
        </div>
      )}

      {activeNav === 'customers' && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Danh sách khách hàng Facebook ({conversations.length})
            </h2>
            {conversations.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có khách hàng nào.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {conversations.map((c) => (
                  <div
                    key={c.id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <UserAvatar src={c.avatar} name={c.name} className="w-10 h-10" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {c.channelName} • {c.phone || 'Chưa có SĐT'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectConversation(c.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#0084FF] text-white text-xs font-semibold cursor-pointer"
                    >
                      Mở chat
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeNav === 'tools' && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Quản lý Fanpage Facebook đã kết nối
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Token được lưu tự động để bạn nhắn tin mỗi ngày mà không cần kết nối lại Facebook cá nhân. Chỉ bấm nút bên cạnh khi muốn thêm Fanpage mới.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDiscoveredPages([]);
                  setSelectedDiscoverIds([]);
                  setConnectModalOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-[#0084FF] hover:bg-[#006FD6] text-white text-xs font-semibold flex items-center space-x-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Fanpage mới</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {fanpages.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Chưa có Fanpage nào được kết nối. Bấm <strong>Thêm Fanpage mới</strong> ở góc trên để bắt đầu.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {fanpages.map((fp) => (
                    <div
                      key={fp.pageId}
                      className="p-4 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <UserAvatar
                          src={fp.avatar}
                          name={fp.name}
                          className="w-11 h-11"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate">
                            {fp.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            Page ID: {fp.pageId} • Đã lưu Token sẵn sàng gửi tin
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFanpage(fp.pageId)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium cursor-pointer"
                      >
                        Gỡ trang
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cửa sổ kết nối Facebook cá nhân & quét Fanpage */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Kết nối Facebook Cá Nhân & Quét Fanpage
              </h3>
              <button
                type="button"
                onClick={() => setConnectModalOpen(false)}
                className="p-1 rounded hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tùy chọn: Dán User Access Token (nếu không dùng cửa sổ đăng nhập)
                </label>
                <input
                  type="text"
                  value={customUserToken}
                  onChange={(e) => setCustomUserToken(e.target.value)}
                  placeholder="Để trống nếu đăng nhập trực tiếp bằng Facebook..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <button
                type="button"
                disabled={isConnectingApi}
                onClick={handleStartFbLogin}
                className="w-full py-2.5 rounded-lg bg-[#0084FF] hover:bg-[#006FD6] text-white font-semibold cursor-pointer"
              >
                {isConnectingApi
                  ? 'Đang lấy danh sách Fanpage...'
                  : 'Tiếp tục với Facebook Cá Nhân'}
              </button>
            </div>

            {discoveredPages.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800">
                  Chọn Fanpage muốn lưu ({selectedDiscoverIds.length}/{discoveredPages.length}):
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {discoveredPages.map((p) => {
                    const checked = selectedDiscoverIds.includes(p.pageId);
                    return (
                      <label
                        key={p.pageId}
                        className="flex items-center space-x-2.5 p-2 rounded-lg border border-slate-200 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setSelectedDiscoverIds((prev) =>
                              prev.includes(p.pageId)
                                ? prev.filter((id) => id !== p.pageId)
                                : [...prev, p.pageId]
                            );
                          }}
                        />
                        <span className="font-semibold text-slate-900">{p.name}</span>
                        <span className="text-slate-400">({p.pageId})</span>
                      </label>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleSaveSelectedPages}
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Lưu & Kích hoạt Fanpage đã chọn
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
