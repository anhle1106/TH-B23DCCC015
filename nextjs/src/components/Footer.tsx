import Link from 'next/link';
import { BookOpen, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-zinc-900 dark:text-white">Mini Library</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Hệ thống tra cứu và quản lý mượn trả tài liệu học tập dành riêng cho sinh viên và giảng viên Khoa CNTT.
            </p>
            <div className="text-xs text-zinc-500">
              © 2026 Mini Library Project. Bảo lưu mọi quyền.
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 text-sm">Liên Kết Nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Trang Chủ & Danh Mục
                </Link>
              </li>
              <li>
                <Link href="/my-shelf" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Tủ Sách Của Tôi
                </Link>
              </li>
              <li>
                <Link href="/admin/books" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Khu Vực Quản Trị
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Cổng Đăng Nhập
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 text-sm">Thông Tin Thư Viện</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>Tầng 3, Nhà A1, Học viện Công nghệ Bưu chính Viễn thông</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>thuvien@library.edu.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                <span>024.3756.2999 (Giờ hành chính)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
