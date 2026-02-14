import { DashboardOutlined, FileSearchOutlined, SettingOutlined, ToolOutlined } from '@ant-design/icons';

const navItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: 'submissions', icon: <FileSearchOutlined />, label: '检测记录' },
  { key: 'codes', icon: <ToolOutlined />, label: '检测码管理' },
  { key: 'settings', icon: <SettingOutlined />, label: '系统设置' }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>AutoTurnitin Console</h1>
      <nav>
        <ul className="nav-list">
          {navItems.map((item, index) => (
            <li key={item.key} className={`nav-item ${index === 0 ? 'active' : ''}`}>
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
