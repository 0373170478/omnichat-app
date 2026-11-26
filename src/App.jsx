import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  MessageSquare,
  ShoppingBag,
  Radio,
  Users,
  BarChart3,
  Bot,
  Wrench,
  Send,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Plus,
  X,
  Check,
  CheckCheck,
  Phone,
  Mail,
  Tag,
  FileText,
  Download,
  Bell,
  ChevronRight,
  ChevronLeft,
  Zap,
  Globe,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  MoreHorizontal,
  Filter,
  Copy,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Settings,
  Key,
  Code2,
  Terminal,
  Trash2,
  Power,
  Building2,
  Lock,
  Layers,
  Webhook,
  FolderKanban,
  Clock,
  Sliders,
  HelpCircle
} from 'lucide-react';

// --- BIỂU TƯỢNG NỀN TẢNG (SVG CHUYÊN BIỆT) ---
const PlatformBadge = ({ platform, size = 'sm' }) => {
  const dim = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-7 h-7';
  const iconDim = size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4';

  if (platform === 'facebook') {
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
  }

  if (platform === 'zalo') {
    return (
      <span
        title="Zalo OA"
        className={`${dim} rounded-full bg-[#0068FF] text-white flex items-center justify-center ring-2 ring-white shadow-sm shrink-0 font-bold`}
        style={{ fontSize: size === 'sm' ? '7px' : size === 'md' ? '8px' : '10px' }}
      >
        Zalo
      </span>
    );
  }

  if (platform === 'tiktok') {
    return (
      <span
        title="TikTok Business"
        className={`${dim} rounded-full bg-[#111111] text-white flex items-center justify-center ring-2 ring-white shadow-sm shrink-0`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconDim}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      </span>
    );
  }

  return null;
};

// --- COMPONENT HIỂN THỊ AVATAR THÔNG MINH (TỰ XỬ LÝ LỖI LINK ẢNH & CHỮ CÁI TÊN) ---
const UserAvatar = ({ src, name, className = 'w-11 h-11' }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const initials = useMemo(() => {
    if (!name) return 'KH';
    const parts = String(name).trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  // Màu nền cố định theo tên khách hàng để mỗi nick có 1 màu nhận diện riêng
  const bgColors = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-purple-500 to-pink-600',
    'from-cyan-500 to-blue-600',
    'from-rose-500 to-red-600'
  ];
  const colorIdx = name
    ? name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % bgColors.length
    : 0;

  if (src && !imgError && !src.startsWith('blob:')) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        onError={() => setImgError(true)}
        className={`${className} rounded-full object-cover border border-slate-200 bg-slate-100 shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${className} rounded-full bg-gradient-to-br ${bgColors[colorIdx]} text-white font-bold flex items-center justify-center border border-white shadow-2xs shrink-0 text-xs`}
    >
      {initials}
    </div>
  );
};

// --- DỮ LIỆU FANPAGE MẶC ĐỊNH (GIỐNG ẢNH SUBIZ CỦA BẠN) ---
const INITIAL_FANPAGES = [
  {
    id: 'page_1',
    pageId: '104829104829101',
    name: 'Vĩnh Long Ford 2S',
    username: '@vinhlongford2s',
    avatarText: '26',
    integratedAt: '10 tháng',
    capiGranted: false,
    pixelId: '',
    messengerCallEnabled: false,
    lastUpdated: '2 tháng',
    updatedBy: 'Sài Gòn Ford',
    connected: true,
    isBusiness: true,
    accessToken: 'EAABsbCS1iHgBO_VL2S_998120491204912049',
    webhookSubscribed: true
  },
  {
    id: 'page_2',
    pageId: '319256744592842',
    name: 'Sài Gòn Ford Tuyển Dụng',
    username: '@319256744592842',
    avatarText: '26',
    integratedAt: '10 tháng',
    capiGranted: false,
    pixelId: '',
    messengerCallEnabled: false,
    lastUpdated: '2 tháng',
    updatedBy: 'Sài Gòn Ford',
    connected: true,
    isBusiness: true,
    accessToken: 'EAABsbCS1iHgBO_SGFTD_7729104829104829',
    webhookSubscribed: true
  },
  {
    id: 'page_3',
    pageId: '104829104829103',
    name: 'Ford Cao Thắng',
    username: '@caothang.fordofficial',
    avatarText: '26',
    integratedAt: '10 tháng',
    capiGranted: false,
    pixelId: '',
    messengerCallEnabled: false,
    lastUpdated: '2 tháng',
    updatedBy: 'Sài Gòn Ford',
    connected: true,
    isBusiness: true,
    accessToken: 'EAABsbCS1iHgBO_FCT_661920481920481920',
    webhookSubscribed: true
  },
  {
    id: 'page_4',
    pageId: '104829104829104',
    name: 'Sài Gòn Ford',
    username: '@SaigonFord.hcmc',
    avatarText: '26',
    integratedAt: '10 tháng',
    capiGranted: false,
    pixelId: '',
    messengerCallEnabled: false,
    lastUpdated: '2 tháng',
    updatedBy: 'Sài Gòn Ford',
    connected: true,
    isBusiness: true,
    accessToken: 'EAABsbCS1iHgBO_SGF_551920481920481920',
    webhookSubscribed: true
  },
  {
    id: 'page_5',
    pageId: '104829104829105',
    name: 'Ford Phố Quang',
    username: '@fordphoquangofficial',
    avatarText: '26',
    integratedAt: '10 tháng',
    capiGranted: false,
    pixelId: '',
    messengerCallEnabled: false,
    lastUpdated: '2 tháng',
    updatedBy: 'Sài Gòn Ford',
    connected: true,
    isBusiness: true,
    accessToken: 'EAABsbCS1iHgBO_FPQ_441920481920481920',
    webhookSubscribed: true
  },
  {
    id: 'page_6',
    pageId: '104829104829106',
    name: 'Sài Gòn Ford - Used Car',
    username: '@saigonfordusedcar',
    avatarText: 'Ford',
    integratedAt: '10 tháng',
    capiGranted: false,
    pixelId: '',
    messengerCallEnabled: false,
    lastUpdated: '2 tháng',
    updatedBy: 'Sài Gòn Ford',
    connected: true,
    isBusiness: false,
    accessToken: 'EAABsbCS1iHgBO_SGFUC_331920481920481920',
    webhookSubscribed: true
  },
  {
    id: 'page_7',
    pageId: '104829104829107',
    name: 'Ford Nam Sài Gòn',
    username: '@namsaigon.ford',
    avatarText: '26',
    integratedAt: '10 tháng',
    capiGranted: false,
    pixelId: '',
    messengerCallEnabled: false,
    lastUpdated: '2 tháng',
    updatedBy: 'Sài Gòn Ford',
    connected: true,
    isBusiness: true,
    accessToken: 'EAABsbCS1iHgBO_FNSG_221920481920481920',
    webhookSubscribed: true
  }
];

// --- DANH SÁCH FANPAGE KHẢ DỤNG KHI QUÉT TỪ FACEBOOK CÁ NHÂN (GET /me/accounts) ---
const DISCOVERABLE_FACEBOOK_PAGES = [
  {
    pageId: '884729104829111',
    name: 'Ford Bình Dương',
    username: '@fordbinhduong.official',
    category: 'Đại lý ô tô',
    avatarText: '26',
    tasks: ['MANAGE', 'CREATE_CONTENT', 'MODERATE', 'MESSAGING', 'ADVERTISE'],
    pageAccessToken: 'EAABsbCS1iHgBO_FBD_NEW_99182736455647382910'
  },
  {
    pageId: '884729104829222',
    name: 'Sài Gòn Ford Service & Bảo Dưỡng',
    username: '@saigonford.service247',
    category: 'Dịch vụ sửa chữa ô tô',
    avatarText: '26',
    tasks: ['MANAGE', 'MODERATE', 'MESSAGING'],
    pageAccessToken: 'EAABsbCS1iHgBO_SGFS_NEW_88172635443322110099'
  },
  {
    pageId: '884729104829333',
    name: 'Ford Cần Thơ - Miền Tây',
    username: '@fordcantho.mientay',
    category: 'Showroom & Dịch vụ',
    avatarText: '26',
    tasks: ['MANAGE', 'CREATE_CONTENT', 'MESSAGING', 'ADVERTISE'],
    pageAccessToken: 'EAABsbCS1iHgBO_FCTMT_NEW_77162534433221109988'
  },
  {
    pageId: '104829104829104',
    name: 'Sài Gòn Ford',
    username: '@SaigonFord.hcmc',
    category: 'Đại lý ô tô chính hãng',
    avatarText: '26',
    tasks: ['MANAGE', 'CREATE_CONTENT', 'MODERATE', 'MESSAGING', 'ADVERTISE'],
    pageAccessToken: 'EAABsbCS1iHgBO_SGF_551920481920481920'
  }
];

// --- DỮ LIỆU MẪU HỘI THOẠI BAN ĐẦU ---
const INITIAL_CONVERSATIONS = [
  {
    id: 'conv_1',
    name: 'Vũ Văn Dũng',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    platform: 'zalo',
    channelName: 'Sài Gòn Ford',
    platformUserId: 'zalo_uid_8491204912',
    phone: '0912 345 678',
    email: 'dung.vuvan@gmail.com',
    leadStage: 'Đang tư vấn',
    unreadCount: 0,
    lastTime: 'Vừa xong',
    tags: ['Đã báo giá', 'Quan tâm Everest'],
    notes: 'Khách quan tâm dòng Ford Everest Titanium 4x4 màu trắng. Đã gửi catalogue PDF bảng giá lăn bánh.',
    activities: [
      { id: 'act_1', time: '10:15, Hôm nay', text: 'Khách hàng bắt đầu hội thoại từ Zalo OA Sài Gòn Ford' },
      { id: 'act_2', time: '13:13, Hôm nay', text: 'Agent Trần Minh đã gửi tệp Báo_giá_Ford_2026.pdf' }
    ],
    messages: [
      {
        id: 'm_101',
        sender: 'customer',
        type: 'text',
        text: 'Chào shop, bên mình gửi giúp anh bảng giá lăn bánh chi tiết bản Titanium tháng này nhé.',
        timestamp: '10:16, Hôm nay'
      },
      {
        id: 'm_102',
        sender: 'agent',
        agentName: 'Trần Minh',
        type: 'text',
        text: 'Bộ phận Cố Vấn Dịch vụ sẽ liên hệ để báo giá dịch vụ tại Sài Gòn Ford trong thời gian sớm nhất.\n\nSài Gòn Ford chân thành cảm ơn Quý Khách đã tin tưởng và lựa chọn dịch vụ, kính chúc Quý Khách một ngày tốt lành! 💙',
        timestamp: '13:12, Hôm nay',
        status: 'read'
      },
      {
        id: 'm_103',
        sender: 'agent',
        agentName: 'Vũ Văn Dũng',
        type: 'pdf',
        text: 'Đây là tài liệu cho bạn',
        fileName: 'Bao_Gia_Lan_Banh_Sai_Gon_Ford_2026.pdf',
        fileSize: '2.4 MB',
        timestamp: '13:13, Hôm nay',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_2',
    name: 'Phạm Văn Tám',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
    platform: 'facebook',
    channelName: 'Sài Gòn Ford',
    platformUserId: 'psid_9876543210',
    phone: '0988 776 543',
    email: 'tam.pham88@yahoo.com',
    leadStage: 'Mới',
    unreadCount: 2,
    lastTime: '4 giờ',
    tags: ['Khách tiềm năng', 'Facebook Ads'],
    notes: 'Tương tác từ bài quảng cáo ưu đãi bảo dưỡng định kỳ.',
    activities: [
      { id: 'act_21', time: '4 giờ trước', text: 'Lead stage set to Qualified bởi hệ thống tự động' }
    ],
    messages: [
      {
        id: 'm_201',
        sender: 'customer',
        type: 'text',
        text: 'Cho mình hỏi gói bảo dưỡng 40.000km hết khoảng bao nhiêu tiền vậy shop?',
        timestamp: '09:20, Hôm nay'
      },
      {
        id: 'm_202',
        sender: 'customer',
        type: 'text',
        text: 'Cuối tuần này thứ 7 còn lịch trống buổi sáng không ạ?',
        timestamp: '09:21, Hôm nay'
      }
    ]
  },
  {
    id: 'conv_3',
    name: 'Minh Anh Official',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=faces',
    platform: 'tiktok',
    channelName: 'TikTok Shop VN',
    platformUserId: 'tt_openid_7729104',
    phone: '0903 112 233',
    email: 'minhanh.creator@gmail.com',
    leadStage: 'Đang tư vấn',
    unreadCount: 1,
    lastTime: '4 giờ',
    tags: ['TikTok Video', 'VIP'],
    notes: 'Khách hỏi mua số lượng sỉ từ video review trên TikTok.',
    activities: [
      { id: 'act_31', time: '4 giờ trước', text: 'Nhắn tin từ Video #8921 trên TikTok Business' }
    ],
    messages: [
      {
        id: 'm_301',
        sender: 'customer',
        type: 'text',
        text: 'Chào shop, mình vừa xem clip trên TikTok. Mẫu phụ kiện này còn đủ màu đen nhám không shop ơi?',
        timestamp: '09:45, Hôm nay'
      }
    ]
  },
  {
    id: 'conv_4',
    name: 'Nhu Le',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces',
    platform: 'zalo',
    channelName: 'Sài Gòn Ford',
    platformUserId: 'zalo_uid_5512093',
    phone: '0938 445 990',
    email: 'nhule.design@gmail.com',
    leadStage: 'Đã báo giá',
    unreadCount: 0,
    lastTime: '4 giờ',
    tags: ['Đã gửi ảnh'],
    notes: 'Đã gửi hình ảnh thực tế nội thất xe.',
    activities: [
      { id: 'act_41', time: '4 giờ trước', text: 'Agent đã gửi 1 hình ảnh' }
    ],
    messages: [
      {
        id: 'm_401',
        sender: 'customer',
        type: 'text',
        text: 'Gửi giúp em hình ảnh thực tế khoang lái với ạ.',
        timestamp: '09:10, Hôm nay'
      },
      {
        id: 'm_402',
        sender: 'agent',
        agentName: 'Trần Minh',
        type: 'image',
        text: 'Em gửi chị hình ảnh thực tế tại showroom bên em ạ:',
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop',
        timestamp: '09:15, Hôm nay',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_5',
    name: 'T Anh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
    platform: 'zalo',
    channelName: 'Sài Gòn Ford',
    platformUserId: 'zalo_uid_3319822',
    phone: '0977 889 112',
    email: 'tanh.nguyen@company.vn',
    leadStage: 'Đang tư vấn',
    unreadCount: 0,
    lastTime: '5 giờ',
    tags: ['Bảo hiểm'],
    notes: 'Cần gia hạn bảo hiểm thân vỏ trong tháng 11.',
    activities: [],
    messages: [
      {
        id: 'm_501',
        sender: 'agent',
        agentName: 'Trần Minh',
        type: 'text',
        text: 'Agent: Gửi một hình ảnh chứng nhận bảo hiểm điện tử.',
        timestamp: '08:30, Hôm nay',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_6',
    name: 'Phung My Hanh',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=faces',
    platform: 'zalo',
    channelName: 'Sài Gòn Ford',
    platformUserId: 'zalo_uid_6648291',
    phone: '0919 223 445',
    email: 'myhanh.phung@gmail.com',
    leadStage: 'Mới',
    unreadCount: 1,
    lastTime: '5 giờ',
    tags: ['Cần gọi lại'],
    notes: 'Khách yêu cầu tư vấn trả góp lãi suất ưu đãi.',
    activities: [],
    messages: [
      {
        id: 'm_601',
        sender: 'customer',
        type: 'text',
        text: 'Chị muốn hỏi thủ tục vay trả góp 80% giá trị xe cần giấy tờ gì em?',
        timestamp: '08:15, Hôm nay'
      }
    ]
  },
  {
    id: 'conv_7',
    name: 'Hoàng Dũng Sg',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=faces',
    platform: 'zalo',
    channelName: 'Sài Gòn Ford',
    platformUserId: 'zalo_uid_9918273',
    phone: '0909 555 888',
    email: 'hoangdung.sg@gmail.com',
    leadStage: 'Chốt đơn',
    unreadCount: 0,
    lastTime: '5 giờ',
    tags: ['VIP', 'Đã đặt cọc'],
    notes: 'Đã đặt cọc 50 triệu. Hẹn giao xe ngày 28/11.',
    activities: [],
    messages: [
      {
        id: 'm_701',
        sender: 'agent',
        agentName: 'Sài Gòn Ford',
        type: 'text',
        text: 'Dạ, Anh/Chị vui lòng cung cấp thông tin CCCD để bên em xuất hóa đơn và làm thủ tục bấm biển số ạ.',
        timestamp: '08:05, Hôm nay',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv_8',
    name: 'Khánh Linh Studio',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=faces',
    platform: 'tiktok',
    channelName: 'TikTok Shop VN',
    platformUserId: 'tt_openid_9938120',
    phone: '0868 990 123',
    email: 'booking@khanhlinhstudio.vn',
    leadStage: 'Đang tư vấn',
    unreadCount: 1,
    lastTime: '6 giờ',
    tags: ['TikTok Live'],
    notes: 'Khách săn voucher trên phiên Live tối qua.',
    activities: [],
    messages: [
      {
        id: 'm_801',
        sender: 'customer',
        type: 'text',
        text: 'Mã giảm giá trên livestream hôm qua còn áp dụng được cho đơn hôm nay không ạ?',
        timestamp: '07:40, Hôm nay'
      }
    ]
  }
];

// --- TIN NHẮN MẪU (QUICK REPLIES) ---
const QUICK_REPLIES = [
  {
    shortcut: '/chao',
    title: 'Lời chào chuẩn đa kênh',
    content: 'Dạ chào Anh/Chị! Cảm ơn Anh/Chị đã liên hệ với hệ thống CSKH. Em có thể hỗ trợ thông tin gì cho mình hôm nay ạ? 😊'
  },
  {
    shortcut: '/baogia',
    title: 'Gửi bảng giá & ưu đãi tháng',
    content: 'Dạ em xin gửi Anh/Chị bảng báo giá niêm yết kèm chương trình ưu đãi đặc biệt trong tháng này. Anh/Chị tham khảo giúp em nhé!'
  },
  {
    shortcut: '/diachi',
    title: 'Địa chỉ Showroom & Giờ làm việc',
    content: 'Bên em mở cửa từ 08:00 - 19:00 tất cả các ngày trong tuần tại Quận 1, TP. Hồ Chí Minh. Rất hân hạnh được đón tiếp Anh/Chị!'
  },
  {
    shortcut: '/xin_sdt',
    title: 'Xin số điện thoại tư vấn',
    content: 'Để bộ phận chuyên viên hỗ trợ nhanh và chính xác nhất, Anh/Chị cho em xin số điện thoại liên hệ của mình được không ạ?'
  },
  {
    shortcut: '/camon',
    title: 'Lời cảm ơn kết thúc hội thoại',
    content: 'Chân thành cảm ơn Quý Khách đã tin tưởng và lựa chọn dịch vụ, kính chúc Quý Khách một ngày tốt lành! 💙'
  }
];

// --- TIN NHẮN MÔ PHỎNG WEBHOOK ĐẾN ---
const DEMO_INCOMING_POOL = [
  {
    platform: 'facebook',
    channelName: 'Sài Gòn Ford',
    name: 'Phạm Văn Tám',
    text: 'Mình vừa nhắn thêm trên Messenger, shop kiểm tra giúp mình lịch hẹn sáng thứ 7 nhé!'
  },
  {
    platform: 'zalo',
    channelName: 'Sài Gòn Ford',
    name: 'Vũ Văn Dũng',
    text: 'Anh đã xem file PDF bảng giá rồi, em tính giúp anh gói trả góp 5 năm nhé.'
  },
  {
    platform: 'tiktok',
    channelName: 'TikTok Shop VN',
    name: 'Minh Anh Official',
    text: 'Shop check tin nhắn giúp mình, mình muốn đặt 5 bộ giao hỏa tốc hôm nay ạ!'
  },
  {
    platform: 'facebook',
    channelName: 'Ford Cao Thắng',
    name: 'Lê Hoàng Nam',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=faces',
    text: 'Chào Fanpage, bên mình có hỗ trợ lái thử xe tận nhà ở Quận 7 không ạ?'
  }
];

// --- CẤU HÌNH API MẶC ĐỊNH CHO CÁC KÊNH ---
const INITIAL_API_CONFIGS = {
  facebook: {
    name: 'Facebook Messenger API',
    pageName: 'Sài Gòn Ford & 6 Fanpage liên kết',
    endpoint: 'https://graph.facebook.com/v21.0/me/messages',
    webhookUrl: 'https://api.omnichat.vn/webhooks/facebook',
    verifyToken: 'omnichat_fb_verify_2026',
    accessToken: 'EAABsbCS1iHgBO_SGF_551920481920481920'
  },
  zalo: {
    name: 'Zalo Official Account (OA) API',
    pageName: 'Zalo OA Sài Gòn Ford',
    endpoint: 'https://openapi.zalo.me/v3.0/oa/message/cs',
    webhookUrl: 'https://api.omnichat.vn/webhooks/zalo',
    verifyToken: 'omnichat_zalo_oa_secret',
    accessToken: 'ZALO_OA_ACCESS_TOKEN_9918273645'
  },
  tiktok: {
    name: 'TikTok Business Messaging API',
    pageName: 'TikTok Shop VN Official',
    endpoint: 'https://business-api.tiktok.com/open_api/v1.3/im/message/send/',
    webhookUrl: 'https://api.omnichat.vn/webhooks/tiktok',
    verifyToken: 'omnichat_tiktok_biz_key',
    accessToken: 'TT_BIZ_TOKEN_77665544332211'
  }
};

const STORAGE_KEY = 'omnichannel_inbox_conversations_v2';
const CONFIG_STORAGE_KEY = 'omnichannel_inbox_api_configs_v2';
const FANPAGES_STORAGE_KEY = 'omnichannel_facebook_fanpages_v2';

// --- ĐOẠN MÃ NGUỒN MẪU TÍCH HỢP GRAPH API V21.0 ---
const CODE_SNIPPETS = {
  frontend: `// 1. Khởi tạo Facebook JavaScript SDK & Đăng nhập Facebook Cá nhân
window.fbAsyncInit = function() {
  FB.init({
    appId      : 'YOUR_META_APP_ID',
    cookie     : true,
    xfbml      : true,
    version    : 'v21.0'
  });
};

// Gọi khi người dùng bấm nút "+ Thêm fanpage"
function connectFacebookPersonalAccount() {
  FB.login(function(response) {
    if (response.authResponse) {
      const shortLivedUserToken = response.authResponse.accessToken;
      // Gửi User Access Token về Backend để lấy danh sách Fanpage & đăng ký Webhook
      fetch('/api/integrations/facebook/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAccessToken: shortLivedUserToken })
      })
      .then(res => res.json())
      .then(data => {
        console.log('Danh sách Fanpage quản lý:', data.pages);
      });
    } else {
      console.warn('Người dùng hủy cấp quyền đăng nhập Facebook.');
    }
  }, {
    // Các quyền bắt buộc để đọc danh sách Page, nhận/gửi tin nhắn & gắn Webhook
    scope: 'pages_show_list,pages_messaging,pages_manage_metadata,pages_read_engagement'
  });
}`,
  backend: `// 2. Backend (Node.js / Express) - Lấy Page Access Token & Đăng ký Webhook
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const GRAPH_API = 'https://graph.facebook.com/v21.0';

app.post('/api/integrations/facebook/connect', async (req, res) => {
  try {
    const { userAccessToken } = req.body;

    // Bước A: Đổi Short-lived Token sang Long-lived User Token (60 ngày)
    const tokenRes = await axios.get(\`\${GRAPH_API}/oauth/access_token\`, {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        fb_exchange_token: userAccessToken
      }
    });
    const longLivedUserToken = tokenRes.data.access_token;

    // Bước B: Quét toàn bộ Fanpage mà Facebook cá nhân đang làm Quản trị viên
    const pagesRes = await axios.get(\`\${GRAPH_API}/me/accounts\`, {
      params: {
        fields: 'id,name,username,picture,access_token,tasks',
        access_token: longLivedUserToken
      }
    });

    const connectedPages = [];
    for (const page of pagesRes.data.data) {
      // Bước C: Đăng ký App nhận sự kiện Webhook (messages, postbacks) cho từng Fanpage
      await axios.post(\`\${GRAPH_API}/\${page.id}/subscribed_apps\`, null, {
        params: {
          subscribed_fields: 'messages,messaging_postbacks,message_deliveries,message_reads',
          access_token: page.access_token // Page Access Token vĩnh viễn
        }
      });

      // Lưu page.id và page.access_token vào Database của hệ thống
      connectedPages.push({
        pageId: page.id,
        name: page.name,
        username: page.username,
        webhookSubscribed: true
      });
    }

    res.json({ success: true, pages: connectedPages });
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
});`,
  webhook: `// 3. Webhook Nhận Tin Nhắn Thời Gian Thực & Gửi Phản Hồi (Send API)
// Xác thực Webhook với Meta Developer Portal
app.get('/webhooks/facebook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Nhận tin nhắn khách hàng gửi vào Fanpage
app.post('/webhooks/facebook', (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      const pageId = entry.id;
      const webhookEvent = entry.messaging[0];
      const senderPsid = webhookEvent.sender.id;

      if (webhookEvent.message) {
        // Đẩy tin nhắn qua Socket.IO lên giao diện Omnichannel Inbox ngay lập tức
        io.emit('new_message', {
          platform: 'facebook',
          pageId,
          senderPsid,
          text: webhookEvent.message.text
        });
      }
    });
    return res.status(200).send('EVENT_RECEIVED');
  }
  res.sendStatus(404);
});

// Gửi tin nhắn trả lời khách hàng từ giao diện Web
async function sendReplyToCustomer(pageAccessToken, recipientPsid, text) {
  return axios.post(
    'https://graph.facebook.com/v21.0/me/messages',
    {
      messaging_type: 'RESPONSE',
      recipient: { id: recipientPsid },
      message: { text }
    },
    { params: { access_token: pageAccessToken } }
  );
}`
};

export default function App() {
  // --- STATE CHÍNH ---
  // Mặc định mở màn hình 'tools' (Cài đặt -> Tích hợp -> Facebook) đúng theo ảnh người dùng gửi
  const [activeNav, setActiveNav] = useState('tools'); // 'messages' | 'orders' | 'live' | 'customers' | 'analytics' | 'ai' | 'tools'
  const [settingsSubMenu, setSettingsSubMenu] = useState('facebook');

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

  const [apiConfigs, setApiConfigs] = useState(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_API_CONFIGS;
    } catch {
      return INITIAL_API_CONFIGS;
    }
  });

  const [selectedId, setSelectedId] = useState('conv_1');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'unread'
  const [platformFilter, setPlatformFilter] = useState('all'); // 'all' | 'facebook' | 'zalo' | 'tiktok'
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');

  // State khung chat giữa
  const [chatSubTab, setChatSubTab] = useState('conversation'); // 'conversation' | 'activity'
  const [messageInput, setMessageInput] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [quickReplyFilter, setQuickReplyFilter] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState('');

  // State cột CRM phải
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [crmForm, setCrmForm] = useState({ phone: '', email: '', leadStage: 'Mới', notes: '' });
  const [crmSavedToast, setCrmSavedToast] = useState(false);

  // State Agent & Thông báo
  const [agentOnline, setAgentOnline] = useState(true);
  const [toastNotification, setToastNotification] = useState(null);
  const [demoIndex, setDemoIndex] = useState(0);
  const [testingApiKey, setTestingApiKey] = useState(null);
  const [apiTestResult, setApiTestResult] = useState({});

  // --- STATE TRÌNH QUẢN LÝ KẾT NỐI FANPAGE & MODAL OAUTH ---
  const [settingsSearch, setSettingsSearch] = useState('');
  const [fanpageSearch, setFanpageSearch] = useState('');
  const [fanpageStatusFilter, setFanpageStatusFilter] = useState('all'); // 'all' | 'connected' | 'no_capi' | 'call_enabled'
  const [selectedFanpageIds, setSelectedFanpageIds] = useState([]);
  const [openRowMenuId, setOpenRowMenuId] = useState(null);

  // Modal kết nối Facebook Cá nhân & Quét Fanpage
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectMode, setConnectMode] = useState('personal'); // 'personal' | 'business'
  const [oauthStep, setOauthStep] = useState(1); // 1: FB Login, 2: Chọn Fanpage, 3: Subscribe Webhook & Done
  const [fbPersonalAccount, setFbPersonalAccount] = useState(null);
  const [customUserToken, setCustomUserToken] = useState('');
  const [selectedNewPageIds, setSelectedNewPageIds] = useState(['884729104829111']);
  const [isConnectingApi, setIsConnectingApi] = useState(false);
  const [apiLogs, setApiLogs] = useState([]);

  // Form tạo Fanpage thủ công ngay trong bước 2 nếu người dùng muốn nhập trang riêng của họ
  const [showManualPageForm, setShowManualPageForm] = useState(false);
  const [manualPage, setManualPage] = useState({ name: '', username: '', pageId: '' });
  const [availablePagesList, setAvailablePagesList] = useState(DISCOVERABLE_FACEBOOK_PAGES);

  // Modal cấp quyền CAPI (Conversions API)
  const [capiModalPage, setCapiModalPage] = useState(null);
  const [pixelIdInput, setPixelIdInput] = useState('');

  // Modal xem Page Access Token & chi tiết kết nối
  const [tokenDetailPage, setTokenDetailPage] = useState(null);

  // Ngăn kéo Tài liệu & Code API
  const [showApiCodeDrawer, setShowApiCodeDrawer] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('frontend');
  const [copiedCode, setCopiedCode] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Lưu localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FANPAGES_STORAGE_KEY, JSON.stringify(fanpages));
    } catch (e) {
      console.error('Lỗi lưu danh sách fanpage:', e);
    }
  }, [fanpages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Lỗi lưu hội thoại:', e);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(apiConfigs));
    } catch (e) {
      console.error('Lỗi lưu cấu hình:', e);
    }
  }, [apiConfigs]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === selectedId) || conversations[0],
    [conversations, selectedId]
  );

  // Đồng bộ form CRM khi đổi khách hàng
  useEffect(() => {
    if (activeConversation) {
      setCrmForm({
        phone: activeConversation.phone || '',
        email: activeConversation.email || '',
        leadStage: activeConversation.leadStage || 'Mới',
        notes: activeConversation.notes || ''
      });
      setIsAddingTag(false);
      setNewTagText('');
    }
  }, [activeConversation?.id]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages?.length, selectedId]);

  // Tính tổng số tin chưa trả lời (động)
  const unreadTotalCount = useMemo(() => {
    // Hiển thị con số thực tế hoặc cộng thêm base nếu cần, ở đây tính chính xác số hội thoại chưa trả lời
    const count = conversations.filter((c) => c.unreadCount > 0).length;
    return count;
  }, [conversations]);

  // Lọc danh sách hội thoại cột 1
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      if (filterTab === 'unread' && conv.unreadCount === 0) return false;
      if (platformFilter !== 'all') {
        if (platformFilter.startsWith('page:')) {
          const targetPageName = platformFilter.replace('page:', '');
          if (conv.platform !== 'facebook' || conv.channelName !== targetPageName) return false;
        } else if (conv.platform !== platformFilter) {
          return false;
        }
      }
      const q = (searchQuery || globalSearch).trim().toLowerCase();
      if (q) {
        const matchName = conv.name.toLowerCase().includes(q);
        const matchPhone = (conv.phone || '').toLowerCase().includes(q);
        const matchLastMsg = conv.messages[conv.messages.length - 1]?.text?.toLowerCase().includes(q);
        return matchName || matchPhone || matchLastMsg;
      }
      return true;
    });
  }, [conversations, filterTab, platformFilter, searchQuery, globalSearch]);

  // Lọc danh sách Fanpage trong bảng quản lý
  const filteredFanpages = useMemo(() => {
    return fanpages.filter((fp) => {
      if (fanpageStatusFilter === 'connected' && !fp.connected) return false;
      if (fanpageStatusFilter === 'no_capi' && fp.capiGranted) return false;
      if (fanpageStatusFilter === 'call_enabled' && !fp.messengerCallEnabled) return false;

      const q = fanpageSearch.trim().toLowerCase();
      if (q) {
        return (
          fp.name.toLowerCase().includes(q) ||
          fp.username.toLowerCase().includes(q) ||
          fp.pageId.includes(q)
        );
      }
      return true;
    });
  }, [fanpages, fanpageSearch, fanpageStatusFilter]);

  const activeFanpagesCount = useMemo(
    () => fanpages.filter((fp) => fp.connected).length,
    [fanpages]
  );

  // Hiển thị thông báo nhỏ góc màn hình
  const triggerToast = (title, desc, platform = null) => {
    setToastNotification({ title, desc, platform });
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  // Chọn cuộc hội thoại & đánh dấu đã đọc
  const handleSelectConversation = (id) => {
    setSelectedId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Xử lý gõ phím trong ô nhập tin nhắn (detect '/' cho Quick Replies)
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

  const handleSelectQuickReply = (content) => {
    setMessageInput(content);
    setShowQuickReplies(false);
    inputRef.current?.focus();
  };

  // Gửi tin nhắn văn bản hoặc đính kèm
  const handleSendMessage = (customPayload = null) => {
    if (!activeConversation) return;
    const textToSend = customPayload ? customPayload.text : messageInput.trim();
    if (!textToSend && !customPayload) return;

    const nowTime = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ', Hôm nay';

    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: 'agent',
      agentName: 'Trần Minh',
      type: customPayload?.type || 'text',
      text: textToSend,
      fileName: customPayload?.fileName,
      fileSize: customPayload?.fileSize,
      imageUrl: customPayload?.imageUrl,
      timestamp: nowTime,
      status: 'sent'
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeConversation.id) return conv;
        return {
          ...conv,
          unreadCount: 0,
          lastTime: 'Vừa xong',
          messages: [...conv.messages, newMsg],
          activities: [
            {
              id: 'act_' + Date.now(),
              time: nowTime,
              text: `Agent Trần Minh đã phản hồi qua ${
                conv.platform === 'facebook'
                  ? 'Messenger API'
                  : conv.platform === 'zalo'
                  ? 'Zalo OA API'
                  : 'TikTok API'
              }`
            },
            ...(conv.activities || [])
          ]
        };
      })
    );

    if (!customPayload) {
      setMessageInput('');
      setShowQuickReplies(false);
      setShowEmojiPicker(false);
    }
  };

  // Mô phỏng đính kèm file PDF hoặc Hình ảnh nhanh
  const handleQuickAttachment = (type) => {
    if (type === 'pdf') {
      handleSendMessage({
        type: 'pdf',
        text: 'Đây là tài liệu báo giá & thông số kỹ thuật dành cho bạn',
        fileName: 'Catalogue_San_Pham_Va_Bang_Gia_2026.pdf',
        fileSize: '1.8 MB'
      });
    } else if (type === 'image') {
      handleSendMessage({
        type: 'image',
        text: 'Gửi Anh/Chị hình ảnh sản phẩm thực tế tại cửa hàng ạ:',
        imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop'
      });
    }
  };

  // Thêm / Xóa Tag khách hàng
  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmed = newTagText.trim();
    if (!trimmed || !activeConversation) return;
    if (!activeConversation.tags.includes(trimmed)) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id ? { ...c, tags: [...c.tags, trimmed] } : c
        )
      );
    }
    setNewTagText('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    if (!activeConversation) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? { ...c, tags: c.tags.filter((t) => t !== tagToRemove) }
          : c
      )
    );
  };

  // Lưu thông tin CRM cột phải
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
              notes: crmForm.notes
            }
          : c
      )
    );
    setCrmSavedToast(true);
    setTimeout(() => setCrmSavedToast(false), 2000);
  };

  // Mô phỏng nhận tin nhắn mới từ Webhook (Facebook / Zalo / TikTok)
  const handleSimulateWebhook = () => {
    // Ưu tiên lấy cả các Fanpage mới được kết nối gần đây
    const activeFbPages = fanpages.filter((f) => f.connected);
    const dynamicPool = [
      ...DEMO_INCOMING_POOL,
      ...(activeFbPages.length > 0
        ? [
            {
              platform: 'facebook',
              channelName: activeFbPages[activeFbPages.length - 1].name,
              name: 'Trần Quốc Bảo',
              avatar:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
              text: `Chào ${activeFbPages[activeFbPages.length - 1].name}, mình nhắn từ Facebook Fanpage vừa kết nối, tư vấn giúp mình nhé!`
            }
          ]
        : [])
    ];

    const sample = dynamicPool[demoIndex % dynamicPool.length];
    setDemoIndex((prev) => prev + 1);

    const nowTime =
      new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', Hôm nay';

    const incomingMsg = {
      id: 'in_' + Date.now(),
      sender: 'customer',
      type: 'text',
      text: sample.text,
      timestamp: nowTime
    };

    setConversations((prev) => {
      const existingIdx = prev.findIndex(
        (c) => c.name === sample.name && c.platform === sample.platform
      );

      if (existingIdx !== -1) {
        const updated = [...prev];
        const target = updated[existingIdx];
        const isCurrentlyOpen = target.id === selectedId && activeNav === 'messages';
        const updatedConv = {
          ...target,
          lastTime: 'Vừa xong',
          unreadCount: isCurrentlyOpen ? 0 : target.unreadCount + 1,
          messages: [...target.messages, incomingMsg],
          activities: [
            { id: 'act_' + Date.now(), time: nowTime, text: `Nhận Webhook POST từ ${sample.platform.toUpperCase()}` },
            ...(target.activities || [])
          ]
        };
        updated.splice(existingIdx, 1);
        return [updatedConv, ...updated];
      } else {
        const newConv = {
          id: 'conv_' + Date.now(),
          name: sample.name,
          avatar:
            sample.avatar ||
            'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&crop=faces',
          platform: sample.platform,
          channelName: sample.channelName,
          platformUserId: 'psid_' + Math.floor(100000000 + Math.random() * 900000000),
          phone: '0901 234 567',
          email: 'khachhang.moi@gmail.com',
          leadStage: 'Mới',
          unreadCount: 1,
          lastTime: 'Vừa xong',
          tags: ['Khách mới', 'Webhook Live'],
          notes: 'Khách hàng mới nhắn tin qua Webhook tự động.',
          activities: [
            { id: 'act_' + Date.now(), time: nowTime, text: `Tạo hội thoại mới từ ${sample.channelName}` }
          ],
          messages: [incomingMsg]
        };
        return [newConv, ...prev];
      }
    });

    const platformLabel =
      sample.platform === 'facebook'
        ? 'Facebook Messenger'
        : sample.platform === 'zalo'
        ? 'Zalo OA'
        : 'TikTok Business';

    triggerToast(`Tin nhắn mới từ ${platformLabel}`, `${sample.name}: "${sample.text}"`, sample.platform);
  };

  // Kiểm tra kết nối API trong tab Công cụ
  const handleTestApiConnection = (platformKey) => {
    setTestingApiKey(platformKey);
    setTimeout(() => {
      setTestingApiKey(null);
      setApiTestResult((prev) => ({
        ...prev,
        [platformKey]: {
          ok: true,
          latency: Math.floor(85 + Math.random() * 60) + 'ms',
          time: new Date().toLocaleTimeString('vi-VN')
        }
      }));
      triggerToast(
        `Kết nối ${apiConfigs[platformKey].name} thành công`,
        'HTTP 200 OK - Webhook đang hoạt động ổn định.',
        platformKey
      );
    }, 650);
  };

  const handleResetDemoData = () => {
    setConversations(INITIAL_CONVERSATIONS);
    setFanpages(INITIAL_FANPAGES);
    setSelectedId('conv_1');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FANPAGES_STORAGE_KEY);
    triggerToast('Đã khôi phục dữ liệu mẫu', 'Toàn bộ Fanpage và hội thoại đã được đặt lại như ban đầu.');
  };

  // --- CÁC HÀM XỬ LÝ KẾT NỐI FACEBOOK CÁ NHÂN & FANPAGE ---
  const openConnectModal = (mode = 'personal') => {
    setConnectMode(mode);
    setOauthStep(fbPersonalAccount ? 2 : 1);
    setApiLogs([]);
    setShowManualPageForm(false);
    setConnectModalOpen(true);
  };

  const handleFacebookPersonalLogin = (useCustomToken = false) => {
    setIsConnectingApi(true);
    setTimeout(() => {
      const profile = {
        name: 'Nguyễn Minh Quân (Business Admin)',
        email: 'quan.nguyen@saigonford.com.vn',
        fbUserId: '1022948172635491',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces',
        userAccessToken:
          useCustomToken && customUserToken.trim()
            ? customUserToken.trim()
            : 'EAABsbCS1iHgBO_LONG_LIVED_USER_TOKEN_2026_99817263',
        expiresIn: '60 ngày'
      };
      setFbPersonalAccount(profile);
      setIsConnectingApi(false);
      setOauthStep(2);
      setApiLogs([
        {
          step: 'POST /v21.0/oauth/access_token',
          status: '200 OK',
          payload: `grant_type=fb_exchange_token -> Long-Lived User Token (${profile.expiresIn})`
        },
        {
          step: 'GET /v21.0/me/accounts?fields=id,name,username,access_token,tasks',
          status: '200 OK',
          payload: `Tìm thấy ${availablePagesList.length} Fanpage có quyền MESSAGING & MANAGE`
        }
      ]);
    }, 600);
  };

  const handleAddManualPageToDiscover = (e) => {
    e.preventDefault();
    if (!manualPage.name.trim()) return;
    const cleanUser = manualPage.username.trim()
      ? manualPage.username.startsWith('@')
        ? manualPage.username.trim()
        : `@${manualPage.username.trim()}`
      : `@${manualPage.name.toLowerCase().replace(/\s+/g, '')}`;
    const newId = manualPage.pageId.trim() || String(Math.floor(100000000000000 + Math.random() * 900000000000000));

    const item = {
      pageId: newId,
      name: manualPage.name.trim(),
      username: cleanUser,
      category: 'Trang doanh nghiệp mới',
      avatarText: manualPage.name.trim().slice(0, 2).toUpperCase(),
      tasks: ['MANAGE', 'MESSAGING', 'MODERATE'],
      pageAccessToken: `EAABsbCS1iHgBO_CUSTOM_${newId.slice(-6)}_${Date.now()}`
    };

    setAvailablePagesList((prev) => [item, ...prev]);
    setSelectedNewPageIds((prev) => [...new Set([...prev, newId])]);
    setManualPage({ name: '', username: '', pageId: '' });
    setShowManualPageForm(false);
  };

  const handleConfirmConnectSelectedPages = () => {
    const pagesToIntegrate = availablePagesList.filter((p) =>
      selectedNewPageIds.includes(p.pageId)
    );
    if (pagesToIntegrate.length === 0) return;

    setIsConnectingApi(true);
    setOauthStep(3);

    setTimeout(() => {
      const generatedLogs = [];
      setFanpages((prev) => {
        const updated = [...prev];
        pagesToIntegrate.forEach((p) => {
          generatedLogs.push({
            step: `POST /v21.0/${p.pageId}/subscribed_apps`,
            status: '200 OK {"success": true}',
            payload: `subscribed_fields: ["messages", "messaging_postbacks", "message_deliveries", "message_reads"]`
          });

          const existingIdx = updated.findIndex((item) => item.pageId === p.pageId);
          if (existingIdx !== -1) {
            updated[existingIdx] = {
              ...updated[existingIdx],
              connected: true,
              lastUpdated: 'Vừa xong',
              updatedBy: 'Sài Gòn Ford',
              accessToken: p.pageAccessToken
            };
          } else {
            updated.unshift({
              id: 'page_' + p.pageId,
              pageId: p.pageId,
              name: p.name,
              username: p.username,
              avatarText: p.avatarText || '26',
              integratedAt: 'Vừa xong',
              capiGranted: false,
              pixelId: '',
              messengerCallEnabled: false,
              lastUpdated: 'Vừa xong',
              updatedBy: 'Sài Gòn Ford',
              connected: true,
              isBusiness: connectMode === 'business',
              accessToken: p.pageAccessToken,
              webhookSubscribed: true
            });
          }
        });
        return updated;
      });

      // Đồng bộ thêm 1 hội thoại mẫu từ Fanpage vừa kết nối vào Inbox
      const firstNewPage = pagesToIntegrate[0];
      setConversations((prev) => {
        const alreadyHas = prev.some((c) => c.channelName === firstNewPage.name);
        if (alreadyHas) return prev;
        return [
          {
            id: 'conv_sync_' + Date.now(),
            name: 'Khách hàng từ ' + firstNewPage.name,
            avatar:
              'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&h=120&fit=crop&crop=faces',
            platform: 'facebook',
            channelName: firstNewPage.name,
            platformUserId: 'psid_' + Math.floor(1000000000 + Math.random() * 9000000000),
            phone: '0909 111 222',
            email: 'khach.fanpage@gmail.com',
            leadStage: 'Mới',
            unreadCount: 1,
            lastTime: 'Vừa xong',
            tags: ['Đồng bộ Graph API', firstNewPage.name],
            notes: `Hội thoại được đồng bộ tự động qua GET /v21.0/${firstNewPage.pageId}/conversations`,
            activities: [
              {
                id: 'act_sync_' + Date.now(),
                time: 'Vừa xong',
                text: `Kết nối Fanpage ${firstNewPage.name} & đăng ký Webhook thành công`
              }
            ],
            messages: [
              {
                id: 'm_sync_' + Date.now(),
                sender: 'customer',
                type: 'text',
                text: `Xin chào ${firstNewPage.name}! Mình cần tư vấn sản phẩm & bảng giá mới nhất ạ.`,
                timestamp: 'Vừa xong'
              }
            ]
          },
          ...prev
        ];
      });

      setApiLogs((prev) => [...prev, ...generatedLogs]);
      setIsConnectingApi(false);
      triggerToast(
        `Đã kết nối ${pagesToIntegrate.length} Fanpage thành công`,
        'Webhook nhận tin nhắn thời gian thực đã được kích hoạt.',
        'facebook'
      );
    }, 800);
  };

  // Bật/tắt gọi Messenger trên từng dòng bảng
  const handleToggleMessengerCall = (pageId) => {
    setFanpages((prev) =>
      prev.map((fp) => {
        if (fp.id !== pageId) return fp;
        const nextVal = !fp.messengerCallEnabled;
        triggerToast(
          nextVal ? 'Đã bật gọi Messenger' : 'Đã tắt gọi Messenger',
          `Fanpage ${fp.name} đã được cập nhật cấu hình cuộc gọi.`,
          'facebook'
        );
        return {
          ...fp,
          messengerCallEnabled: nextVal,
          lastUpdated: 'Vừa xong'
        };
      })
    );
  };

  // Mở modal cấp quyền CAPI
  const handleOpenCapiModal = (fp) => {
    setCapiModalPage(fp);
    setPixelIdInput(fp.pixelId || '849201948271645');
  };

  const handleSaveCapiGrant = (e) => {
    e.preventDefault();
    if (!capiModalPage) return;
    setFanpages((prev) =>
      prev.map((fp) =>
        fp.id === capiModalPage.id
          ? {
              ...fp,
              capiGranted: true,
              pixelId: pixelIdInput.trim() || '849201948271645',
              lastUpdated: 'Vừa xong'
            }
          : fp
      )
    );
    triggerToast(
      'Đã cấp quyền Conversions API (CAPI)',
      `Ghi nhận chuyển đổi mua hàng từ Messenger cho ${capiModalPage.name}.`,
      'facebook'
    );
    setCapiModalPage(null);
  };

  // Ngắt kết nối / Kết nối lại / Xóa Fanpage
  const handleTogglePageConnection = (id) => {
    setFanpages((prev) =>
      prev.map((fp) => {
        if (fp.id !== id) return fp;
        const nextConn = !fp.connected;
        triggerToast(
          nextConn ? 'Đã khôi phục kết nối Webhook' : 'Đã tạm ngắt kết nối Fanpage',
          fp.name,
          'facebook'
        );
        return { ...fp, connected: nextConn, lastUpdated: 'Vừa xong' };
      })
    );
    setOpenRowMenuId(null);
  };

  const handleRemoveFanpage = (id) => {
    setFanpages((prev) => prev.filter((fp) => fp.id !== id));
    setOpenRowMenuId(null);
    triggerToast('Đã gỡ tích hợp Fanpage', 'Trang đã được xóa khỏi danh sách quản lý.');
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#F4F6F9] text-slate-800 overflow-hidden font-sans select-none sm:select-auto">
      {/* ==================== 1. TOP NAVIGATION BAR (ĐẬM CHẤT SUBIZ #0F294A) ==================== */}
      <header className="h-12 bg-[#0F294A] text-white flex items-center justify-between px-3 lg:px-5 shrink-0 shadow-md z-30">
        {/* Bên trái: Logo + Menu điều hướng */}
        <div className="flex items-center h-full space-x-1 md:space-x-2 overflow-x-auto no-scrollbar">
          {/* Logo Brand */}
          <div
            onClick={() => setActiveNav('messages')}
            className="flex items-center space-x-2 pr-3 mr-1 cursor-pointer shrink-0"
          >
            <div className="w-7 h-7 rounded-full bg-white text-[#0F294A] flex items-center justify-center shadow-sm">
              <MessageSquare className="w-4 h-4 fill-[#0F294A]" />
            </div>
            <span className="font-bold text-base tracking-tight hidden sm:inline">
              Omni<span className="text-sky-400">Chat</span>
            </span>
          </div>

          {/* Các tab điều hướng chính */}
          {[
            { id: 'messages', label: 'Tin nhắn', icon: MessageSquare, badge: unreadTotalCount },
            { id: 'orders', label: 'Đơn & Sản phẩm', icon: ShoppingBag },
            { id: 'live', label: 'Live', icon: Radio },
            { id: 'customers', label: 'Khách', icon: Users },
            { id: 'analytics', label: 'Thống kê', icon: BarChart3 },
            { id: 'ai', label: 'Nhân viên AI', icon: Bot },
            { id: 'tools', label: 'Công cụ', icon: Wrench }
          ].map((item) => {
            const isActive = activeNav === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`relative h-full px-2.5 lg:px-3.5 flex items-center space-x-1.5 text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-[#173A67]'
                    : 'text-slate-300 hover:text-white hover:bg-[#15355E]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 lg:hidden" />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-[#0084FF] text-white rounded-full">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-sky-400 rounded-t" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bên phải: Code API, Webhook Demo, Trạng thái Agent, Tài khoản */}
        <div className="flex items-center space-x-2 lg:space-x-2.5 shrink-0">
          {/* Nút mở Tài liệu & Code API */}
          <button
            onClick={() => setShowApiCodeDrawer(true)}
            title="Xem & sao chép mã nguồn kết nối Facebook Graph API"
            className="flex items-center space-x-1.5 bg-[#183B68] hover:bg-[#214B82] text-sky-300 border border-sky-400/30 text-xs font-medium px-2.5 py-1.5 rounded-md transition"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Code API</span>
          </button>

          {/* Nút giả lập Webhook nhận tin nhắn thời gian thực */}
          <button
            onClick={handleSimulateWebhook}
            title="Mô phỏng nhận tin nhắn mới từ Facebook / Zalo / TikTok"
            className="flex items-center space-x-1.5 bg-[#1877F2] hover:bg-blue-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md shadow-sm transition active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden lg:inline">Nhận tin mới (Demo)</span>
          </button>

          {/* Nút bánh răng Cài đặt nhanh */}
          <button
            onClick={() => {
              setActiveNav('tools');
              setSettingsSubMenu('facebook');
            }}
            title="Cài đặt & Tích hợp kênh"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
              activeNav === 'tools'
                ? 'bg-sky-500 text-white'
                : 'bg-[#183B68] text-slate-200 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Trạng thái Online/Offline & Tên tài khoản SÀI GÒN FORD */}
          <button
            onClick={() => setAgentOnline(!agentOnline)}
            className="flex items-center space-x-2 bg-[#163660] hover:bg-[#1D4478] px-2.5 py-1 rounded-full border border-slate-600/50 transition"
            title="Nhấn để chuyển trạng thái trực tuyến"
          >
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-amber-100 text-[#0F294A] font-extrabold text-[10px] flex items-center justify-center">
                SG
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-[#0F294A] ${
                  agentOnline ? 'bg-emerald-400' : 'bg-slate-400'
                }`}
              />
            </div>
            <span className="text-xs font-semibold hidden sm:inline tracking-wide">
              SÀI GÒN F...
            </span>
          </button>
        </div>
      </header>

      {/* ==================== TOAST THÔNG BÁO THỜI GIAN THỰC ==================== */}
      {toastNotification && (
        <div className="fixed top-14 right-4 z-50 max-w-sm bg-white border border-slate-200 shadow-xl rounded-lg p-3 flex items-start space-x-3 animate-bounce">
          <div className="mt-0.5">
            {toastNotification.platform ? (
              <PlatformBadge platform={toastNotification.platform} size="lg" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900">{toastNotification.title}</p>
            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{toastNotification.desc}</p>
          </div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ==================== NỘI DUNG CHÍNH THEO TAB ==================== */}
      {activeNav === 'messages' && (
        <main className="flex-1 flex min-h-0 overflow-hidden">
          {/* -------------------- CỘT 1: DANH SÁCH HỘI THOẠI (~320px) -------------------- */}
          <aside className="w-full sm:w-[310px] lg:w-[325px] bg-white border-r border-slate-200 flex flex-col shrink-0">
            {/* Header cột hội thoại */}
            <div className="px-4 pt-3 pb-2 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-2">
                  <h2 className="text-[16px] font-bold text-slate-800">Hội thoại</h2>
                  <span className="text-[11px] text-slate-400 font-medium">
                    ({filteredConversations.length})
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm hội thoại..."
                    className="pl-7 pr-2 py-1 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-transparent focus:border-sky-400 rounded-md w-36 focus:w-44 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Bộ lọc Tab: Tất cả | Chưa trả lời (Badge xanh dương) */}
              <div className="flex items-center space-x-4 border-b border-slate-100 pb-2">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`text-[13px] font-semibold pb-1 transition relative ${
                    filterTab === 'all'
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Tất cả
                  {filterTab === 'all' && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-[#0F294A]" />
                  )}
                </button>

                <button
                  onClick={() => setFilterTab('unread')}
                  className={`flex items-center space-x-1.5 text-[13px] font-semibold pb-1 transition relative ${
                    filterTab === 'unread'
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span>Chưa trả lời</span>
                  <span className="px-1.5 py-0.2 text-[11px] font-bold bg-[#0084FF] text-white rounded">
                    {unreadTotalCount}
                  </span>
                  {filterTab === 'unread' && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-[#0F294A]" />
                  )}
                </button>
              </div>

              {/* Bộ lọc nhanh theo nền tảng: Tất cả / Facebook / Zalo / TikTok + Từng Fanpage */}
              <div className="flex items-center space-x-1.5 pt-2.5 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'Tất cả kênh' },
                  { id: 'facebook', label: 'Tất cả Facebook' },
                  { id: 'zalo', label: 'Zalo OA' },
                  { id: 'tiktok', label: 'TikTok' }
                ].map((pf) => (
                  <button
                    key={pf.id}
                    onClick={() => setPlatformFilter(pf.id)}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-[11px] font-medium border transition shrink-0 ${
                      platformFilter === pf.id
                        ? 'bg-[#0F294A] text-white border-[#0F294A]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pf.id !== 'all' && <PlatformBadge platform={pf.id} size="sm" />}
                    <span>{pf.label}</span>
                  </button>
                ))}
              </div>

              {/* Bộ lọc chọn riêng từng Fanpage đã kết nối */}
              <div className="mt-2">
                <select
                  value={platformFilter.startsWith('page:') ? platformFilter : ''}
                  onChange={(e) => setPlatformFilter(e.target.value || 'all')}
                  className="w-full text-[11.5px] bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium outline-none focus:border-[#1877F2]"
                >
                  <option value="">-- Lọc theo Fanpage cụ thể ({activeFanpagesCount} trang) --</option>
                  {fanpages
                    .filter((f) => f.connected)
                    .map((fp) => (
                      <option key={fp.id} value={`page:${fp.name}`}>
                        📘 {fp.name} ({fp.username})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Danh sách các cuộc hội thoại */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Không tìm thấy cuộc hội thoại nào phù hợp.
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === activeConversation?.id;
                  const lastMsg = conv.messages[conv.messages.length - 1];
                  const previewText =
                    lastMsg?.type === 'pdf'
                      ? `📄 ${lastMsg.fileName}`
                      : lastMsg?.type === 'image'
                      ? '🖼️ Đã gửi một hình ảnh'
                      : lastMsg?.sender === 'agent'
                      ? `Agent: ${lastMsg.text}`
                      : lastMsg?.text || '';

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`px-3.5 py-3 flex items-start space-x-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#EBF3FE] border-l-[3px] border-l-[#0084FF]'
                          : 'hover:bg-slate-50 border-l-[3px] border-l-transparent'
                      }`}
                    >
                      {/* Avatar + Huy hiệu nền tảng góc dưới phải */}
                      <div className="relative shrink-0">
                        <UserAvatar
                          src={conv.avatar}
                          name={conv.name}
                          className="w-11 h-11"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5">
                          <PlatformBadge platform={conv.platform} size="sm" />
                        </div>
                      </div>

                      {/* Nội dung tóm tắt hội thoại */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4
                            className={`text-[13.5px] truncate ${
                              conv.unreadCount > 0
                                ? 'font-bold text-slate-900'
                                : 'font-semibold text-slate-800'
                            }`}
                          >
                            {conv.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 shrink-0">
                            {conv.lastTime}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p
                            className={`text-xs truncate ${
                              conv.unreadCount > 0
                                ? 'font-semibold text-slate-800'
                                : 'text-slate-500'
                            }`}
                          >
                            {previewText}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                          )}
                        </div>

                        <div className="mt-1 flex items-center space-x-1.5 text-[10px] text-slate-400">
                          <span className="truncate max-w-[140px]">{conv.channelName}</span>
                          {conv.tags?.[0] && (
                            <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded truncate max-w-[90px]">
                              {conv.tags[0]}
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

          {/* -------------------- CỘT 2: KHUNG CHAT TRUNG TÂM -------------------- */}
          {activeConversation ? (
            <section className="flex-1 flex flex-col min-w-0 bg-[#F4F6F9]">
              {/* Header khung chat */}
              <div className="bg-white border-b border-slate-200 px-4 py-2.5 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative shrink-0">
                      <UserAvatar
                        src={activeConversation.avatar}
                        name={activeConversation.name}
                        className="w-10 h-10"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <PlatformBadge platform={activeConversation.platform} size="sm" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-bold text-[15px] text-slate-900 truncate">
                          {activeConversation.name}
                        </h3>
                        <div className="flex items-center space-x-3 text-xs font-semibold">
                          <button
                            onClick={() => setChatSubTab('activity')}
                            className={`pb-0.5 transition ${
                              chatSubTab === 'activity'
                                ? 'text-[#0084FF] border-b-2 border-[#0084FF]'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Hoạt động
                          </button>
                          <button
                            onClick={() => setChatSubTab('conversation')}
                            className={`pb-0.5 transition ${
                              chatSubTab === 'conversation'
                                ? 'text-[#0084FF] border-b-2 border-[#0084FF]'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Hội thoại
                          </button>
                        </div>
                      </div>

                      <div className="text-[11.5px] text-slate-500 flex items-center space-x-1.5 mt-0.5">
                        <span>
                          {activeConversation.platform === 'facebook'
                            ? 'Facebook Messenger'
                            : activeConversation.platform === 'zalo'
                            ? 'Zalo OA'
                            : 'TikTok Business'}
                        </span>
                        <span>•</span>
                        <span className="font-medium text-slate-700">
                          {activeConversation.channelName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nút bật/tắt cột CRM phải */}
                  <button
                    onClick={() => setShowRightPanel(!showRightPanel)}
                    className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 flex items-center space-x-1 shrink-0"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden md:inline">
                      {showRightPanel ? 'Ẩn thông tin' : 'Thông tin khách'}
                    </span>
                  </button>
                </div>

                {/* Hàng Tags khách hàng */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {activeConversation.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-medium"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-600 ml-0.5"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}

                  {isAddingTag ? (
                    <form onSubmit={handleAddTag} className="inline-flex items-center space-x-1">
                      <input
                        type="text"
                        autoFocus
                        value={newTagText}
                        onChange={(e) => setNewTagText(e.target.value)}
                        placeholder="Tên nhãn..."
                        className="px-2 py-0.5 text-[11px] border border-sky-400 rounded outline-none w-28"
                      />
                      <button
                        type="submit"
                        className="px-2 py-0.5 bg-[#0084FF] text-white rounded text-[11px] font-semibold"
                      >
                        Lưu
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddingTag(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsAddingTag(true)}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Thêm Tags</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Nội dung luồng tin nhắn hoặc Lịch sử hoạt động */}
              {chatSubTab === 'activity' ? (
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nhật ký hoạt động & Webhook Logs
                  </h4>
                  {(activeConversation.activities || []).length === 0 ? (
                    <p className="text-xs text-slate-400">Chưa có lịch sử hoạt động nào.</p>
                  ) : (
                    activeConversation.activities.map((act) => (
                      <div
                        key={act.id}
                        className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <span className="text-slate-700 font-medium">{act.text}</span>
                        <span className="text-slate-400 text-[11px]">{act.time}</span>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4">
                  {activeConversation.messages.map((msg) => {
                    const isAgent = msg.sender === 'agent';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center space-x-1.5 mb-1 text-[11px] text-slate-400">
                          {!isAgent && (
                            <span className="font-semibold text-slate-600">
                              {activeConversation.name}
                            </span>
                          )}
                          {isAgent && (
                            <span className="font-semibold text-slate-600">
                              {msg.agentName || 'Agent'}
                            </span>
                          )}
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        <div
                          className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed shadow-2xs ${
                            isAgent
                              ? 'bg-[#E3F1FF] text-slate-900 rounded-tr-sm border border-blue-200/70'
                              : 'bg-white text-slate-800 rounded-tl-sm border border-slate-200'
                          }`}
                        >
                          {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}

                          {msg.type === 'pdf' && (
                            <div className="mt-2 p-2.5 rounded-xl bg-white border border-slate-200 flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-red-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                PDF
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-slate-800 truncate">
                                  {msg.fileName}
                                </p>
                                <p className="text-[11px] text-slate-400">{msg.fileSize}</p>
                              </div>
                              <button
                                onClick={() =>
                                  triggerToast('Đang tải tệp PDF', msg.fileName)
                                }
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                                title="Tải xuống"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {msg.type === 'image' && msg.imageUrl && (
                            <div className="mt-2 overflow-hidden rounded-xl border border-slate-200">
                              <img
                                src={msg.imageUrl}
                                alt="Đính kèm"
                                className="max-h-60 w-auto object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Khung nhập tin nhắn & Tin nhắn mẫu '/' */}
              <div className="bg-white border-t border-slate-200 p-3 relative shrink-0">
                {showQuickReplies && (
                  <div className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20 max-h-60 overflow-y-auto">
                    <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 flex items-center justify-between">
                      <span>TIN NHẮN MẪU NHANH (Chọn để chèn)</span>
                      <button
                        onClick={() => setShowQuickReplies(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {filteredQuickReplies.map((qr) => (
                      <button
                        key={qr.shortcut}
                        onClick={() => handleSelectQuickReply(qr.content)}
                        className="w-full text-left px-3.5 py-2 hover:bg-blue-50 border-b border-slate-100 last:border-b-0 transition"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.5 rounded bg-sky-100 text-[#0084FF] font-mono text-[11px] font-bold">
                            {qr.shortcut}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{qr.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{qr.content}</p>
                      </button>
                    ))}
                  </div>
                )}

                {showEmojiPicker && (
                  <div className="absolute bottom-full left-3 mb-2 bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 flex items-center space-x-2 z-20">
                    {['😊', '👍', '❤️', '💙', '🙏', '🚗', '🔥', '🎉'].map((em) => (
                      <button
                        key={em}
                        onClick={() => {
                          setMessageInput((prev) => prev + em);
                          setShowEmojiPicker(false);
                          inputRef.current?.focus();
                        }}
                        className="text-lg hover:scale-125 transition p-1"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-end space-x-2">
                  <div className="flex-1 bg-slate-50 border border-slate-200 focus-within:border-[#0084FF] focus-within:bg-white rounded-xl px-3 py-2 transition">
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
                      placeholder="Nhập '/' để chọn tin nhắn mẫu, Enter để gửi..."
                      className="w-full bg-transparent text-[13.5px] text-slate-800 outline-none resize-none"
                    />
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/70">
                      <div className="flex items-center space-x-1.5 text-slate-500">
                        <button
                          type="button"
                          onClick={() => setShowQuickReplies(!showQuickReplies)}
                          title="Tin nhắn mẫu (/)"
                          className="p-1.5 rounded hover:bg-slate-200/70 hover:text-[#0084FF] transition text-xs font-bold"
                        >
                          / Mẫu
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAttachment('image')}
                          title="Gửi hình ảnh mẫu"
                          className="p-1.5 rounded hover:bg-slate-200/70 hover:text-[#0084FF] transition"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAttachment('pdf')}
                          title="Gửi tài liệu PDF báo giá"
                          className="p-1.5 rounded hover:bg-slate-200/70 hover:text-red-600 transition"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          title="Biểu tượng cảm xúc"
                          className="p-1.5 rounded hover:bg-slate-200/70 hover:text-amber-500 transition"
                        >
                          <Smile className="w-4 h-4" />
                        </button>
                      </div>

                      <span className="text-[10.5px] text-slate-400 hidden sm:inline">
                        Gửi qua {activeConversation.channelName}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!messageInput.trim()}
                    className="h-11 px-4 rounded-xl bg-[#0084FF] hover:bg-blue-600 disabled:bg-slate-300 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm transition shrink-0"
                  >
                    <span>Gửi</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
              Chọn một cuộc hội thoại để bắt đầu
            </div>
          )}

          {/* -------------------- CỘT 3: HỒ SƠ CRM KHÁCH HÀNG (~290px) -------------------- */}
          {showRightPanel && activeConversation && (
            <aside className="hidden xl:flex w-[290px] bg-white border-l border-slate-200 flex-col shrink-0 overflow-y-auto p-4 space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-slate-100">
                <UserAvatar
                  src={activeConversation.avatar}
                  name={activeConversation.name}
                  className="w-16 h-16 mx-auto border-2 border-slate-100 shadow-xs text-base"
                />
                <h4 className="font-bold text-sm text-slate-900 mt-2">
                  {activeConversation.name}
                </h4>
                <div className="inline-flex items-center space-x-1 mt-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px]">
                  <PlatformBadge platform={activeConversation.platform} size="sm" />
                  <span>{activeConversation.channelName}</span>
                </div>
              </div>

              {/* Giai đoạn Lead */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Giai đoạn khách hàng</label>
                <select
                  value={crmForm.leadStage}
                  onChange={(e) => setCrmForm({ ...crmForm, leadStage: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-slate-50 font-semibold text-slate-800 outline-none focus:border-[#0084FF]"
                >
                  <option value="Mới">Mới (New Lead)</option>
                  <option value="Đang tư vấn">Đang tư vấn</option>
                  <option value="Đã báo giá">Đã báo giá</option>
                  <option value="Chốt đơn">Chốt đơn / Đặt cọc</option>
                </select>
              </div>

              {/* Số điện thoại & Email */}
              <div className="space-y-2.5">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={crmForm.phone}
                      onChange={(e) => setCrmForm({ ...crmForm, phone: e.target.value })}
                      className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-[#0084FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={crmForm.email}
                      onChange={(e) => setCrmForm({ ...crmForm, email: e.target.value })}
                      className="w-full pl-8 pr-2.5 py-1.5 border border-slate-300 rounded-lg outline-none focus:border-[#0084FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 mb-1">
                    Platform User ID (PSID / UID)
                  </label>
                  <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-600">
                    <span className="truncate">{activeConversation.platformUserId}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(activeConversation.platformUserId);
                        triggerToast('Đã sao chép User ID', activeConversation.platformUserId);
                      }}
                      className="text-[#0084FF] font-sans font-semibold ml-1 shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Ghi chú nội bộ */}
              <div>
                <label className="block font-bold text-slate-600 mb-1">Ghi chú chăm sóc</label>
                <textarea
                  rows={4}
                  value={crmForm.notes}
                  onChange={(e) => setCrmForm({ ...crmForm, notes: e.target.value })}
                  placeholder="Ghi chú nhu cầu khách hàng..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#0084FF] resize-none"
                />
              </div>

              <button
                onClick={handleSaveCrm}
                className="w-full py-2 rounded-lg bg-[#0F294A] hover:bg-[#173A67] text-white font-semibold transition flex items-center justify-center space-x-1.5"
              >
                {crmSavedToast ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Đã lưu hồ sơ khách hàng!</span>
                  </>
                ) : (
                  <span>Lưu thông tin CRM</span>
                )}
              </button>
            </aside>
          )}
        </main>
      )}

      {/* ==================== MÀN HÌNH 1: TRÌNH QUẢN LÝ TÍCH HỢP FACEBOOK & FANPAGE (CHUẨN SUBIZ) ==================== */}
      {activeNav === 'tools' && (
        <main className="flex-1 flex min-h-0 overflow-hidden bg-white">
          {/* SIDEBAR CÀI ĐẶT BÊN TRÁI (~225px GIỐNG HỆT ẢNH) */}
          <aside className="hidden md:flex w-[225px] bg-[#F8FAFC] border-r border-slate-200 flex-col shrink-0 overflow-y-auto">
            {/* Ô tìm kiếm cài đặt */}
            <div className="p-3 border-b border-slate-200/80">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settingsSearch}
                  onChange={(e) => setSettingsSearch(e.target.value)}
                  placeholder="Tìm kiếm cài đặt"
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:border-[#1877F2] outline-none"
                />
              </div>
            </div>

            <div className="p-2.5 space-y-5 text-[13px]">
              {/* Nhóm TÀI KHOẢN */}
              <div>
                <div className="px-2.5 mb-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  TÀI KHOẢN
                </div>
                <ul className="space-y-0.5">
                  {['Thông tin', 'Thanh toán', 'Agent', 'Nhóm agent', 'Ngôn ngữ'].map((label) => (
                    <li key={label}>
                      <button
                        onClick={() => triggerToast(`Mục cài đặt: ${label}`, 'Đang ở chế độ xem trước cấu hình.')}
                        className="w-full text-left px-2.5 py-1.5 rounded-md text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 transition text-[12.5px]"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nhóm TÍCH HỢP */}
              <div>
                <div className="px-2.5 mb-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  TÍCH HỢP
                </div>
                <ul className="space-y-0.5">
                  {[
                    { id: 'website', label: 'Website', color: 'text-sky-500', badgeIcon: '🌐' },
                    { id: 'facebook', label: 'Facebook', color: 'text-[#1877F2]', badgeIcon: 'f' },
                    { id: 'zalo_oa', label: 'Zalo OA', color: 'text-blue-600', badgeIcon: 'Zalo' },
                    { id: 'zalo_personal', label: 'Zalo cá nhân', color: 'text-blue-500', badgeIcon: 'Z' },
                    { id: 'instagram', label: 'Instagram', color: 'text-pink-600', badgeIcon: '📷' },
                    { id: 'tiktok', label: 'TikTok', color: 'text-slate-900', badgeIcon: '🎵' },
                    { id: 'call', label: 'Tổng đài', color: 'text-emerald-600', badgeIcon: '📞' },
                    { id: 'whatsapp', label: 'WhatsApp', beta: true, color: 'text-green-600', badgeIcon: '💬' },
                    { id: 'email', label: 'Email', color: 'text-red-500', badgeIcon: '✉️' },
                    { id: 'google', label: 'Google', color: 'text-amber-500', badgeIcon: 'G' },
                    { id: 'youtube', label: 'YouTube', beta: true, color: 'text-red-600', badgeIcon: '▶️' },
                    { id: 'webhook', label: 'Webhook', color: 'text-indigo-600', badgeIcon: '🔗' }
                  ]
                    .filter((item) =>
                      item.label.toLowerCase().includes(settingsSearch.trim().toLowerCase())
                    )
                    .map((item) => {
                      const active = settingsSubMenu === item.id;
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => setSettingsSubMenu(item.id)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12.5px] transition ${
                              active
                                ? 'bg-[#EBF3FE] text-[#1877F2] font-semibold'
                                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                            }`}
                          >
                            <span className="flex items-center space-x-2">
                              <span
                                className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                                  item.id === 'facebook'
                                    ? 'bg-[#1877F2] text-white'
                                    : 'bg-slate-200/70 ' + item.color
                                }`}
                              >
                                {item.badgeIcon}
                              </span>
                              <span>{item.label}</span>
                            </span>
                            {item.beta && (
                              <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-sky-100 text-sky-700 rounded">
                                Beta
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>

              {/* Nhóm HỘI THOẠI */}
              <div>
                <div className="px-2.5 mb-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  HỘI THOẠI
                </div>
                <ul className="space-y-0.5">
                  {[
                    'Bot',
                    'Mẫu tin nhắn',
                    'Hoàn thành hội thoại',
                    'Rule phân phối',
                    'Tag',
                    'Giờ làm việc'
                  ].map((label) => (
                    <li key={label}>
                      <button
                        onClick={() =>
                          triggerToast(`Cấu hình ${label}`, 'Bạn có thể sử dụng trực tiếp trong khung chat.')
                        }
                        className="w-full text-left px-2.5 py-1.5 rounded-md text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 transition text-[12.5px]"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* NỘI DUNG CHÍNH BÊN PHẢI: TÍCH HỢP FACEBOOK & DANH SÁCH FANPAGE */}
          {settingsSubMenu === 'facebook' ? (
            <section className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-white">
              <div className="p-5 lg:p-7 max-w-[1380px] w-full mx-auto">
                {/* Hàng 1: Tiêu đề Facebook + Nút Thêm fanpage */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-md bg-[#1877F2] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                        f
                      </div>
                      <h1 className="text-xl font-bold text-slate-900">Facebook</h1>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                        {fanpages.length}
                      </span>
                    </div>

                    {/* Dòng trạng thái quota giống Subiz */}
                    <p className="text-[13px] text-slate-600 mt-2">
                      Đang hoạt động:{' '}
                      <strong className="font-semibold text-slate-900">{activeFanpagesCount}</strong>.
                      Đã tích hợp{' '}
                      <strong className="font-semibold text-slate-900">{fanpages.length}</strong> /
                      100.{' '}
                      <button
                        onClick={() =>
                          triggerToast('Gói doanh nghiệp', 'Bạn đang có sẵn 100 kết nối Fanpage miễn phí.')
                        }
                        className="text-[#1877F2] hover:underline font-medium ml-1"
                      >
                        Mua thêm
                      </button>
                    </p>
                  </div>

                  {/* Các nút hành động góc phải */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setActiveNav('messages')}
                      className="px-3 py-2 rounded-md border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition flex items-center space-x-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Mở Hộp thư ({unreadTotalCount})</span>
                    </button>

                    <button
                      onClick={() => openConnectModal('personal')}
                      className="px-3.5 py-2 rounded-md bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold shadow-2xs transition flex items-center space-x-1.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-slate-600" />
                      <span>Thêm fanpage</span>
                    </button>

                    <button
                      onClick={() => openConnectModal('business')}
                      className="px-3.5 py-2 rounded-md bg-[#1877F2] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm fanpage doanh nghiệp</span>
                    </button>
                  </div>
                </div>

                {/* Banner hiển thị tài khoản Facebook Cá nhân đang liên kết (nếu đã login OAuth) */}
                {fbPersonalAccount && (
                  <div className="mt-4 px-4 py-2.5 rounded-lg bg-[#EBF3FE] border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={fbPersonalAccount.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-blue-300"
                      />
                      <div>
                        <span className="text-slate-600">Đang liên kết Facebook cá nhân: </span>
                        <strong className="text-slate-900">{fbPersonalAccount.name}</strong>
                        <span className="text-slate-500 ml-2">
                          (Token hết hạn sau {fbPersonalAccount.expiresIn})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => openConnectModal('personal')}
                        className="text-[#1877F2] font-semibold hover:underline"
                      >
                        + Quét thêm trang mới
                      </button>
                      <button
                        onClick={() => {
                          setFbPersonalAccount(null);
                          triggerToast('Đã đăng xuất Facebook cá nhân', 'Các Page Access Token đã lưu vẫn tiếp tục hoạt động.');
                        }}
                        className="text-slate-500 hover:text-red-600"
                      >
                        Ngắt liên kết cá nhân
                      </button>
                    </div>
                  </div>
                )}

                {/* Hàng 2: Thanh tìm kiếm & Bộ lọc trạng thái */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fanpageSearch}
                        onChange={(e) => setFanpageSearch(e.target.value)}
                        placeholder="Tìm tên, username Facebook..."
                        className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md w-60 focus:border-[#1877F2] outline-none"
                      />
                    </div>

                    <select
                      value={fanpageStatusFilter}
                      onChange={(e) => setFanpageStatusFilter(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-700 font-medium focus:border-[#1877F2] outline-none"
                    >
                      <option value="all">Tất cả kết nối</option>
                      <option value="connected">Đã kết nối ({activeFanpagesCount})</option>
                      <option value="no_capi">Chưa cấp quyền CAPI</option>
                      <option value="call_enabled">Đã bật gọi Messenger</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <button
                      onClick={() => setShowApiCodeDrawer(true)}
                      className="text-[#1877F2] hover:underline font-medium flex items-center space-x-1"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Hướng dẫn & Code API kết nối</span>
                    </button>
                  </div>
                </div>

                {/* Hàng 3: BẢNG DANH SÁCH FANPAGE (Y HỆT ẢNH SUBIZ) */}
                <div className="mt-4 border border-slate-200 rounded-lg overflow-visible bg-white shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-[#FAFAFB] text-[12px] font-semibold text-slate-600">
                          <th className="py-3 pl-4 pr-2 w-10">
                            <input
                              type="checkbox"
                              checked={
                                filteredFanpages.length > 0 &&
                                selectedFanpageIds.length === filteredFanpages.length
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFanpageIds(filteredFanpages.map((f) => f.id));
                                } else {
                                  setSelectedFanpageIds([]);
                                }
                              }}
                              className="rounded border-slate-300 text-[#1877F2] focus:ring-0"
                            />
                          </th>
                          <th className="py-3 px-3">Tài khoản</th>
                          <th className="py-3 px-3">Tích hợp lúc</th>
                          <th className="py-3 px-3">Ghi nhận chuyển đổi</th>
                          <th className="py-3 px-3">Gọi Messenger</th>
                          <th className="py-3 px-3">Cập nhật cuối</th>
                          <th className="py-3 px-3">Kết nối</th>
                          <th className="py-3 pl-2 pr-4 text-right w-20"></th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 text-[13px]">
                        {filteredFanpages.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-10 text-center text-xs text-slate-400">
                              Không tìm thấy Fanpage nào phù hợp với bộ lọc hiện tại.
                            </td>
                          </tr>
                        ) : (
                          filteredFanpages.map((fp) => {
                            const isChecked = selectedFanpageIds.includes(fp.id);
                            return (
                              <tr
                                key={fp.id}
                                className="hover:bg-slate-50/90 transition-colors group"
                              >
                                {/* Checkbox */}
                                <td className="py-3.5 pl-4 pr-2">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedFanpageIds((prev) => [...prev, fp.id]);
                                      } else {
                                        setSelectedFanpageIds((prev) =>
                                          prev.filter((item) => item !== fp.id)
                                        );
                                      }
                                    }}
                                    className="rounded border-slate-300 text-[#1877F2] focus:ring-0"
                                  />
                                </td>

                                {/* Cột Tài khoản: Avatar tròn + Tên + @username */}
                                <td className="py-3.5 px-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0068FF] to-[#00A3FF] text-white flex flex-col items-center justify-center shrink-0 border border-blue-200 shadow-2xs">
                                      <span className="text-[11px] font-extrabold leading-none">
                                        {fp.avatarText}
                                      </span>
                                      <span className="text-[6px] uppercase tracking-tighter opacity-90 mt-0.5">
                                        FORD
                                      </span>
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-semibold text-slate-900 text-[13px] truncate">
                                        {fp.name}
                                      </div>
                                      <div className="text-[11.5px] text-slate-400 truncate">
                                        {fp.username}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Cột Tích hợp lúc */}
                                <td className="py-3.5 px-3 text-slate-600 text-[12.5px]">
                                  {fp.integratedAt}
                                </td>

                                {/* Cột Ghi nhận chuyển đổi (CAPI) */}
                                <td className="py-3.5 px-3">
                                  <div className="text-[11px] text-slate-400 mb-1">
                                    {fp.capiGranted
                                      ? `Đã cấp quyền (Pixel: ${fp.pixelId})`
                                      : 'Chưa cấp quyền'}
                                  </div>
                                  <button
                                    onClick={() => handleOpenCapiModal(fp)}
                                    className={`px-2.5 py-1 rounded border text-[11.5px] font-medium transition ${
                                      fp.capiGranted
                                        ? 'bg-sky-50 border-sky-200 text-[#1877F2]'
                                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                    }`}
                                  >
                                    {fp.capiGranted ? 'Cấu hình CAPI' : 'Cấp quyền CAPI'}
                                  </button>
                                </td>

                                {/* Cột Gọi Messenger */}
                                <td className="py-3.5 px-3">
                                  <div className="text-[11px] text-slate-400 mb-1">
                                    {fp.messengerCallEnabled ? 'Đã bật gọi thoại' : 'Chưa bật'}
                                  </div>
                                  <button
                                    onClick={() => handleToggleMessengerCall(fp.id)}
                                    className={`px-2.5 py-1 rounded border text-[11.5px] font-medium transition ${
                                      fp.messengerCallEnabled
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                    }`}
                                  >
                                    {fp.messengerCallEnabled
                                      ? 'Đang bật gọi Messenger'
                                      : 'Bật gọi Messenger'}
                                  </button>
                                </td>

                                {/* Cột Cập nhật cuối */}
                                <td className="py-3.5 px-3">
                                  <div className="text-[12.5px] text-slate-700">{fp.lastUpdated}</div>
                                  <div className="text-[11px] text-slate-400">{fp.updatedBy}</div>
                                </td>

                                {/* Cột Kết nối (Badge xanh nhạt Đã kết nối) */}
                                <td className="py-3.5 px-3">
                                  {fp.connected ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#E6F7ED] text-[#15803D] text-[11.5px] font-medium">
                                      Đã kết nối
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-[11.5px] font-medium">
                                      Ngắt kết nối
                                    </span>
                                  )}
                                </td>

                                {/* Cột Action: Nút bánh răng API + Dấu 3 chấm */}
                                <td className="py-3.5 pl-2 pr-4 text-right relative">
                                  <div className="inline-flex items-center space-x-1.5">
                                    <button
                                      onClick={() => setTokenDetailPage(fp)}
                                      title="Xem Page Access Token & Trạng thái Webhook"
                                      className="p-1.5 rounded-full text-slate-400 hover:text-[#1877F2] hover:bg-slate-100 transition"
                                    >
                                      <Settings className="w-4 h-4" />
                                    </button>

                                    <div className="relative">
                                      <button
                                        onClick={() =>
                                          setOpenRowMenuId(openRowMenuId === fp.id ? null : fp.id)
                                        }
                                        className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                      >
                                        <MoreHorizontal className="w-4 h-4" />
                                      </button>

                                      {openRowMenuId === fp.id && (
                                        <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-30 text-left text-xs">
                                          <button
                                            onClick={() => {
                                              setPlatformFilter(`page:${fp.name}`);
                                              setActiveNav('messages');
                                              setOpenRowMenuId(null);
                                            }}
                                            className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
                                          >
                                            <MessageSquare className="w-3.5 h-3.5 text-[#1877F2]" />
                                            <span>Xem tin nhắn trang này</span>
                                          </button>
                                          <button
                                            onClick={() => {
                                              setTokenDetailPage(fp);
                                              setOpenRowMenuId(null);
                                            }}
                                            className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
                                          >
                                            <Key className="w-3.5 h-3.5 text-amber-500" />
                                            <span>Xem Page Access Token</span>
                                          </button>
                                          <button
                                            onClick={() => handleTogglePageConnection(fp.id)}
                                            className="w-full px-3 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
                                          >
                                            <Power className="w-3.5 h-3.5 text-emerald-600" />
                                            <span>
                                              {fp.connected
                                                ? 'Tạm ngắt kết nối'
                                                : 'Kích hoạt lại kết nối'}
                                            </span>
                                          </button>
                                          <div className="border-t border-slate-100 my-1" />
                                          <button
                                            onClick={() => handleRemoveFanpage(fp.id)}
                                            className="w-full px-3 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Gỡ tích hợp Fanpage</span>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            /* CÁC KÊNH TÍCH HỢP KHÁC TRONG SIDEBAR (ZALO OA, TIKTOK, WEBHOOK...) */
            <section className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              <div className="max-w-4xl mx-auto space-y-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 capitalize">
                      Cấu hình tích hợp: {settingsSubMenu.replace('_', ' ')}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Quản lý Endpoint API & Webhook đồng bộ tin nhắn về hộp thư hợp nhất.
                    </p>
                  </div>
                  <button
                    onClick={() => setSettingsSubMenu('facebook')}
                    className="px-3 py-1.5 rounded-md bg-[#1877F2] text-white text-xs font-semibold"
                  >
                    Quay lại quản lý Facebook
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(apiConfigs).map(([key, cfg]) => {
                    const testStatus = apiTestResult[key];
                    return (
                      <div
                        key={key}
                        className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <PlatformBadge platform={key} size="md" />
                              <span className="font-bold text-xs text-slate-900">{cfg.name}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 mb-2">{cfg.pageName}</p>
                          <div className="text-[10px] font-mono bg-slate-50 p-2 rounded border border-slate-200 truncate">
                            {cfg.webhookUrl}
                          </div>
                        </div>

                        {testStatus && (
                          <div className="text-[11px] text-emerald-600 font-medium">
                            ✓ HTTP 200 OK ({testStatus.latency})
                          </div>
                        )}

                        <button
                          onClick={() => handleTestApiConnection(key)}
                          className="w-full py-1.5 rounded bg-[#0F294A] text-white text-xs font-semibold hover:bg-[#173A67]"
                        >
                          {testingApiKey === key ? 'Đang kiểm tra...' : 'Kiểm tra kết nối API'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </main>
      )}

      {/* ==================== MODAL KẾT NỐI FACEBOOK CÁ NHÂN & QUÉT FANPAGE (META OAUTH 2.0) ==================== */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="px-6 py-4 bg-[#0F294A] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-extrabold">
                  f
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    {connectMode === 'business'
                      ? 'Kết nối Fanpage Doanh Nghiệp (Meta Business Suite)'
                      : 'Kết nối Facebook Cá Nhân & Quét Fanpage Quản Lý'}
                  </h3>
                  <p className="text-[11px] text-sky-300">
                    Meta Graph API v21.0 • OAuth 2.0 & Webhook Auto-Subscription
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConnectModalOpen(false)}
                className="text-slate-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thanh tiến trình 3 bước */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
              {[
                { step: 1, title: '1. Đăng nhập Facebook Cá nhân' },
                { step: 2, title: '2. Chọn Fanpage quản lý' },
                { step: 3, title: '3. Gắn Webhook & Hoàn tất' }
              ].map((s) => (
                <div
                  key={s.step}
                  className={`flex items-center space-x-1.5 font-semibold ${
                    oauthStep === s.step
                      ? 'text-[#1877F2]'
                      : oauthStep > s.step
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                      oauthStep === s.step
                        ? 'bg-[#1877F2] text-white'
                        : oauthStep > s.step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {oauthStep > s.step ? '✓' : s.step}
                  </span>
                  <span className="hidden sm:inline">{s.title}</span>
                </div>
              ))}
            </div>

            {/* Nội dung từng bước */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              {/* BƯỚC 1: ĐĂNG NHẬP FACEBOOK CÁ NHÂN */}
              {oauthStep === 1 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      Tại sao cần kết nối tài khoản Facebook Cá nhân?
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      Theo chuẩn bảo mật của Meta, mọi Fanpage đều được quản trị thông qua tài khoản
                      Facebook cá nhân (hoặc tài khoản Business Manager). Hệ thống sẽ xin cấp quyền
                      tạm thời để gọi endpoint <code className="bg-white px-1 py-0.5 rounded border">GET /me/accounts</code> và
                      lấy <strong>Page Access Token</strong> riêng cho từng trang.
                    </p>
                  </div>

                  {/* Danh sách quyền OAuth Scopes */}
                  <div>
                    <p className="font-bold text-slate-700 mb-2">
                      Các quyền (Permissions / Scopes) yêu cầu cấp phép:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        {
                          scope: 'pages_show_list',
                          desc: 'Lấy danh sách Fanpage bạn đang làm quản trị viên'
                        },
                        {
                          scope: 'pages_messaging',
                          desc: 'Nhận và gửi tin nhắn Messenger thay mặt Fanpage'
                        },
                        {
                          scope: 'pages_manage_metadata',
                          desc: 'Tự động đăng ký Webhook nhận tin nhắn thời gian thực'
                        },
                        {
                          scope: 'pages_read_engagement',
                          desc: 'Đọc thông tin khách hàng, avatar và bình luận bài viết'
                        }
                      ].map((item) => (
                        <div
                          key={item.scope}
                          className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 flex items-start space-x-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <code className="font-bold text-[#1877F2]">{item.scope}</code>
                            <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tùy chọn nhập User Access Token thủ công nếu dev muốn test */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block font-semibold text-slate-600 mb-1">
                      Tùy chọn: Dán User Access Token từ Meta Graph Explorer (nếu có)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={customUserToken}
                        onChange={(e) => setCustomUserToken(e.target.value)}
                        placeholder="EAABsbCS1iHgBO..."
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg font-mono text-[11px] outline-none focus:border-[#1877F2]"
                      />
                      {customUserToken.trim() && (
                        <button
                          onClick={() => handleFacebookPersonalLogin(true)}
                          className="px-3 py-2 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-700"
                        >
                          Dùng Token này
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Nút chính Continue with Facebook */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleFacebookPersonalLogin(false)}
                      disabled={isConnectingApi}
                      className="w-full py-3 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-sm shadow-md transition flex items-center justify-center space-x-2.5"
                    >
                      <span className="w-6 h-6 rounded-full bg-white text-[#1877F2] font-black flex items-center justify-center text-base">
                        f
                      </span>
                      <span>
                        {isConnectingApi
                          ? 'Đang xác thực với Facebook OAuth...'
                          : 'Tiếp tục với Facebook Cá Nhân (Nguyễn Minh Quân)'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* BƯỚC 2: CHỌN CÁC FANPAGE ĐANG QUẢN LÝ */}
              {oauthStep === 2 && (
                <div className="space-y-4">
                  {/* Thông tin tài khoản Facebook cá nhân đã xác thực */}
                  {fbPersonalAccount && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center space-x-3">
                        <img
                          src={fbPersonalAccount.avatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{fbPersonalAccount.name}</div>
                          <div className="text-[11px] text-emerald-700">
                            ✓ Đã cấp quyền <code>GET /v21.0/me/accounts</code> • User ID:{' '}
                            {fbPersonalAccount.fbUserId}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowManualPageForm(!showManualPageForm)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                      >
                        + Nhập trang thủ công
                      </button>
                    </div>
                  )}

                  {/* Form thêm nhanh trang của chính người dùng để test */}
                  {showManualPageForm && (
                    <form
                      onSubmit={handleAddManualPageToDiscover}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                    >
                      <div className="font-bold text-slate-800">
                        Thêm Fanpage của bạn vào danh sách chọn:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          value={manualPage.name}
                          onChange={(e) => setManualPage({ ...manualPage, name: e.target.value })}
                          placeholder="Tên Fanpage (VD: Shop Thời Trang A)"
                          className="px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                        />
                        <input
                          type="text"
                          value={manualPage.username}
                          onChange={(e) =>
                            setManualPage({ ...manualPage, username: e.target.value })
                          }
                          placeholder="@username"
                          className="px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                        />
                        <div className="flex space-x-1.5">
                          <input
                            type="text"
                            value={manualPage.pageId}
                            onChange={(e) =>
                              setManualPage({ ...manualPage, pageId: e.target.value })
                            }
                            placeholder="Page ID (tùy chọn)"
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 rounded bg-[#1877F2] text-white font-semibold shrink-0"
                          >
                            Thêm
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Danh sách Fanpage trả về từ Graph API */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-800">
                        Chọn các Fanpage bạn muốn kết nối vào phần mềm ({selectedNewPageIds.length}{' '}
                        đã chọn):
                      </span>
                      <button
                        onClick={() =>
                          setSelectedNewPageIds(availablePagesList.map((p) => p.pageId))
                        }
                        className="text-[#1877F2] font-semibold hover:underline"
                      >
                        Chọn tất cả
                      </button>
                    </div>

                    <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                      {availablePagesList.map((page) => {
                        const checked = selectedNewPageIds.includes(page.pageId);
                        const alreadyInTable = fanpages.some(
                          (f) => f.pageId === page.pageId && f.connected
                        );
                        return (
                          <label
                            key={page.pageId}
                            className={`p-3 flex items-center justify-between cursor-pointer transition ${
                              checked ? 'bg-blue-50/60' : 'bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedNewPageIds((prev) => [...prev, page.pageId]);
                                  } else {
                                    setSelectedNewPageIds((prev) =>
                                      prev.filter((id) => id !== page.pageId)
                                    );
                                  }
                                }}
                                className="rounded text-[#1877F2] w-4 h-4"
                              />
                              <div className="w-9 h-9 rounded-full bg-[#1877F2] text-white font-bold flex items-center justify-center">
                                {page.avatarText}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 flex items-center space-x-2">
                                  <span>{page.name}</span>
                                  {alreadyInTable && (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[10px]">
                                      Đã có trong danh sách
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {page.username} • ID: {page.pageId} • {page.category}
                                </div>
                              </div>
                            </div>

                            <div className="hidden sm:flex flex-wrap gap-1 justify-end max-w-[160px]">
                              {page.tasks.slice(0, 2).map((t) => (
                                <span
                                  key={t}
                                  className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-mono"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* BƯỚC 3: KẾT QUẢ ĐĂNG KÝ WEBHOOK & API LOGS */}
              {oauthStep === 3 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-emerald-900 text-sm">
                        Tích hợp Fanpage & Đăng ký Webhook hoàn tất!
                      </h4>
                      <p className="text-emerald-700 mt-0.5">
                        Hệ thống đã lưu Page Access Token và kích hoạt nhận tin nhắn thời gian thực
                        về Hộp thư đến.
                      </p>
                    </div>
                  </div>

                  {/* Console Log các lệnh Graph API đã chạy */}
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-[11px] space-y-2.5 max-h-56 overflow-y-auto">
                    <div className="text-slate-400 border-b border-slate-700 pb-1.5 flex items-center justify-between">
                      <span>META GRAPH API v21.0 EXECUTION LOGS</span>
                      <span className="text-emerald-400">● LIVE</span>
                    </div>
                    {apiLogs.map((log, i) => (
                      <div key={i} className="space-y-0.5">
                        <div className="flex items-center justify-between text-sky-400">
                          <span>{log.step}</span>
                          <span className="text-emerald-400">{log.status}</span>
                        </div>
                        <div className="text-slate-400 pl-2">{log.payload}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              {oauthStep === 2 ? (
                <>
                  <button
                    onClick={() => setOauthStep(1)}
                    className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-white"
                  >
                    ← Đổi tài khoản FB
                  </button>
                  <button
                    onClick={handleConfirmConnectSelectedPages}
                    disabled={selectedNewPageIds.length === 0 || isConnectingApi}
                    className="px-5 py-2 rounded-lg bg-[#1877F2] hover:bg-blue-600 disabled:bg-slate-300 text-white text-xs font-bold shadow-sm transition"
                  >
                    {isConnectingApi
                      ? 'Đang đăng ký Webhook...'
                      : `Kết nối ${selectedNewPageIds.length} Fanpage & Bật Webhook`}
                  </button>
                </>
              ) : oauthStep === 3 ? (
                <>
                  <button
                    onClick={() => setConnectModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-white"
                  >
                    Ở lại trang Quản lý Fanpage
                  </button>
                  <button
                    onClick={() => {
                      setConnectModalOpen(false);
                      setActiveNav('messages');
                    }}
                    className="px-5 py-2 rounded-lg bg-[#0F294A] hover:bg-[#173A67] text-white text-xs font-bold shadow-sm"
                  >
                    Mở Hộp thư đến ngay →
                  </button>
                </>
              ) : (
                <div className="w-full flex justify-end">
                  <button
                    onClick={() => setConnectModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-white"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL CẤP QUYỀN CONVERSIONS API (CAPI) ==================== */}
      {capiModalPage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCapiGrant}
            className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden text-xs"
          >
            <div className="px-5 py-3.5 bg-[#0F294A] text-white flex items-center justify-between">
              <span className="font-bold text-sm">Cấp quyền Meta Conversions API (CAPI)</span>
              <button
                type="button"
                onClick={() => setCapiModalPage(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-slate-600 leading-relaxed">
                Gửi sự kiện chuyển đổi đơn hàng từ khung chat Messenger của trang{' '}
                <strong className="text-slate-900">{capiModalPage.name}</strong> về Trình quản lý
                quảng cáo Meta để tối ưu giá thầu tin nhắn.
              </p>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Meta Dataset / Pixel ID
                </label>
                <input
                  type="text"
                  required
                  value={pixelIdInput}
                  onChange={(e) => setPixelIdInput(e.target.value)}
                  placeholder="Nhập Meta Pixel ID (VD: 849201948271645)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:border-[#1877F2] outline-none"
                />
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setCapiModalPage(null)}
                className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-600 font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#1877F2] text-white font-semibold hover:bg-blue-600"
              >
                Xác nhận cấp quyền CAPI
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL CHI TIẾT PAGE ACCESS TOKEN & WEBHOOK ==================== */}
      {tokenDetailPage && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden text-xs">
            <div className="px-5 py-3.5 bg-[#0F294A] text-white flex items-center justify-between">
              <span className="font-bold text-sm">
                Thông số API & Webhook — {tokenDetailPage.name}
              </span>
              <button
                onClick={() => setTokenDetailPage(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Facebook Page ID
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded font-mono">
                  <span>{tokenDetailPage.pageId}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(tokenDetailPage.pageId);
                      triggerToast('Đã sao chép Page ID', tokenDetailPage.pageId);
                    }}
                    className="text-[#1877F2] font-sans font-semibold"
                  >
                    Sao chép
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Page Access Token (Dùng cho Send API)
                </label>
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded font-mono">
                  <span className="truncate pr-2">{tokenDetailPage.accessToken}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(tokenDetailPage.accessToken);
                      triggerToast('Đã sao chép Page Access Token', 'Sẵn sàng dùng cho Graph API');
                    }}
                    className="text-[#1877F2] font-sans font-semibold shrink-0"
                  >
                    Sao chép
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  Webhook Subscribed Fields
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'messages',
                    'messaging_postbacks',
                    'message_deliveries',
                    'message_reads',
                    'messaging_optins'
                  ].map((field) => (
                    <span
                      key={field}
                      className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px]"
                    >
                      ✓ {field}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setTokenDetailPage(null)}
                className="px-4 py-1.5 rounded bg-[#0F294A] text-white font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== NGĂN KÉO TÀI LIỆU & MÃ NGUỒN LIÊN KẾT GRAPH API ==================== */}
      {showApiCodeDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col">
            <div className="px-5 py-4 bg-[#0F294A] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="text-sm font-bold">
                    Mã Nguồn Liên Kết Facebook Cá Nhân & Fanpage (Graph API v21.0)
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Sao chép trực tiếp vào dự án Frontend / Backend của bạn
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowApiCodeDrawer(false)}
                className="text-slate-300 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs chọn đoạn code */}
            <div className="px-5 pt-3 bg-slate-100 border-b border-slate-200 flex items-center space-x-2 shrink-0">
              {[
                { id: 'frontend', label: '1. Frontend (FB.login OAuth)' },
                { id: 'backend', label: '2. Backend (/me/accounts & Webhook)' },
                { id: 'webhook', label: '3. Nhận & Gửi Tin Nhắn' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveCodeTab(t.id)}
                  className={`px-3.5 py-2 rounded-t-lg text-xs font-semibold transition ${
                    activeCodeTab === t.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Vùng hiển thị Code */}
            <div className="flex-1 bg-slate-900 text-slate-100 p-4 overflow-auto relative font-mono text-xs leading-relaxed">
              <button
                onClick={() => handleCopyCode(CODE_SNIPPETS[activeCodeTab])}
                className="sticky top-0 float-right px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-600 text-xs font-sans font-semibold flex items-center space-x-1.5"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép Code</span>
                  </>
                )}
              </button>
              <pre className="whitespace-pre-wrap">{CODE_SNIPPETS[activeCodeTab]}</pre>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CÁC TAB PHỤ KHÁC (KHÁCH HÀNG / THỐNG KÊ / AI...) ==================== */}
      {activeNav !== 'messages' && activeNav !== 'tools' && (
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            {activeNav === 'customers' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900">
                    Danh bạ Khách hàng Đa nền tảng ({conversations.length})
                  </h2>
                  <button
                    onClick={() => setActiveNav('messages')}
                    className="text-xs font-semibold text-[#0084FF] hover:underline"
                  >
                    Mở khung chat →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                        <th className="py-2.5 px-3">Khách hàng</th>
                        <th className="py-2.5 px-3">Kênh</th>
                        <th className="py-2.5 px-3">Số điện thoại</th>
                        <th className="py-2.5 px-3">Trạng thái</th>
                        <th className="py-2.5 px-3">Nhãn (Tags)</th>
                        <th className="py-2.5 px-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {conversations.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-800 flex items-center space-x-2">
                            <img src={c.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                            <span>{c.name}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center space-x-1.5">
                              <PlatformBadge platform={c.platform} size="sm" />
                              <span className="capitalize">{c.platform}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{c.phone}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-medium">
                              {c.leadStage}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex flex-wrap gap-1">
                              {c.tags.map((t) => (
                                <span
                                  key={t}
                                  className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                handleSelectConversation(c.id);
                                setActiveNav('messages');
                              }}
                              className="px-2.5 py-1 rounded bg-[#0084FF] text-white font-medium hover:bg-blue-600"
                            >
                              Nhắn tin
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeNav !== 'customers' && (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-sky-50 text-[#0084FF] flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Phân hệ{' '}
                  {activeNav === 'orders'
                    ? 'Đơn & Sản phẩm'
                    : activeNav === 'live'
                    ? 'Giám sát Khách truy cập Live'
                    : activeNav === 'analytics'
                    ? 'Báo cáo & Thống kê Hiệu suất CSKH'
                    : 'Trợ lý Nhân viên AI Tự động'}
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Dữ liệu đồng bộ trực tiếp từ 3 kênh Facebook Messenger ({conversations.filter((c) => c.platform === 'facebook').length} hội thoại), Zalo OA ({conversations.filter((c) => c.platform === 'zalo').length} hội thoại) và TikTok ({conversations.filter((c) => c.platform === 'tiktok').length} hội thoại).
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveNav('messages')}
                    className="px-4 py-2 rounded-lg bg-[#0F294A] text-white text-xs font-semibold hover:bg-[#173A67] transition"
                  >
                    Quay về Hộp thư Hợp nhất
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
