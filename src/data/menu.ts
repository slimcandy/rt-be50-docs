// The router's own menu, in the router's order and with the router's English
// labels, so the guide's left menu and tab bar match what the reader sees on
// the real device. Every guide page is one router tab; `asp` is that tab's
// address on the router and is used for the "open on the router" link.

export type IconName =
  | 'guide'
  | 'map'
  | 'mesh'
  | 'net'
  | 'pc'
  | 'qos'
  | 'wifi'
  | 'lan'
  | 'wan'
  | 'v6'
  | 'vpn'
  | 'fw'
  | 'adm'
  | 'log'
  | 'tools'
  | 'shield'

export type Tab = {
  title: string
  href: string
  asp?: string
}

export type MenuItem = {
  title: string
  icon: IconName
  tabs: Array<Tab>
  // The first item is drawn like the router's "Quick Internet Setup" header.
  lead?: boolean
}

export type MenuGroup = {
  split?: string
  items: Array<MenuItem>
}

export const menu: Array<MenuGroup> = [
  {
    items: [
      {
        title: 'О справочнике',
        icon: 'guide',
        lead: true,
        tabs: [{ title: 'Как читать', href: '/' }],
      },
    ],
  },
  {
    split: 'General',
    items: [
      {
        title: 'Network Map',
        icon: 'map',
        tabs: [{ title: 'Network Map', href: '/network-map', asp: 'index.asp' }],
      },
      {
        title: 'AiMesh',
        icon: 'mesh',
        tabs: [{ title: 'AiMesh', href: '/aimesh', asp: 'AiMesh.asp' }],
      },
      {
        title: 'Network',
        icon: 'net',
        tabs: [{ title: 'Network', href: '/network', asp: 'SDN.asp' }],
      },
      {
        title: 'Parental Controls',
        icon: 'pc',
        tabs: [
          {
            title: 'Time Scheduling',
            href: '/parental-controls/time-scheduling',
            asp: 'ParentalControl.asp',
          },
          {
            title: 'AdGuard',
            href: '/parental-controls/adguard',
            asp: 'adGuard_DNS.asp',
          },
        ],
      },
      {
        title: 'QoS',
        icon: 'qos',
        tabs: [
          { title: 'QoS', href: '/qos', asp: 'QoS_EZQoS.asp' },
          {
            title: 'Internet Speed',
            href: '/qos/internet-speed',
            asp: 'AdaptiveQoS_InternetSpeed.asp',
          },
          {
            title: 'Traffic Monitor',
            href: '/qos/traffic-monitor',
            asp: 'Main_TrafficMonitor_realtime.asp',
          },
        ],
      },
    ],
  },
  {
    split: 'Advanced Settings',
    items: [
      {
        title: 'Wireless',
        icon: 'wifi',
        tabs: [
          {
            title: 'General',
            href: '/wireless/general',
            asp: 'Advanced_Wireless_Content.asp',
          },
          {
            title: 'WPS',
            href: '/wireless/wps',
            asp: 'Advanced_WWPS_Content.asp',
          },
          {
            title: 'WDS',
            href: '/wireless/wds',
            asp: 'Advanced_WMode_Content.asp',
          },
          {
            title: 'Professional',
            href: '/wireless/professional',
            asp: 'Advanced_WAdvanced_Content.asp',
          },
          {
            title: 'Roaming Block List',
            href: '/wireless/roaming-block-list',
            asp: 'Advanced_Roaming_Block_Content.asp',
          },
          { title: 'MLO', href: '/wireless/mlo', asp: 'MLO.asp' },
        ],
      },
      {
        title: 'LAN',
        icon: 'lan',
        tabs: [
          { title: 'LAN IP', href: '/lan/lan-ip', asp: 'Advanced_LAN_Content.asp' },
          {
            title: 'DHCP Server',
            href: '/lan/dhcp-server',
            asp: 'Advanced_DHCP_Content.asp',
          },
          {
            title: 'Route',
            href: '/lan/route',
            asp: 'Advanced_GWStaticRoute_Content.asp',
          },
          { title: 'IPTV', href: '/lan/iptv', asp: 'Advanced_IPTV_Content.asp' },
          {
            title: 'Switch Control',
            href: '/lan/switch-control',
            asp: 'Advanced_SwitchCtrl_Content.asp',
          },
        ],
      },
      {
        title: 'WAN',
        icon: 'wan',
        tabs: [
          {
            title: 'Internet Connection',
            href: '/wan/internet-connection',
            asp: 'Advanced_WAN_Content.asp',
          },
          {
            title: 'Dual WAN',
            href: '/wan/dual-wan',
            asp: 'Advanced_WANPort_Content.asp',
          },
          {
            title: 'Port Trigger',
            href: '/wan/port-trigger',
            asp: 'Advanced_PortTrigger_Content.asp',
          },
          {
            title: 'Virtual Server / Port Forwarding',
            href: '/wan/port-forwarding',
            asp: 'Advanced_VirtualServer_Content.asp',
          },
          { title: 'DMZ', href: '/wan/dmz', asp: 'Advanced_Exposed_Content.asp' },
          { title: 'DDNS', href: '/wan/ddns', asp: 'Advanced_ASUSDDNS_Content.asp' },
          {
            title: 'NAT Passthrough',
            href: '/wan/nat-passthrough',
            asp: 'Advanced_NATPassThrough_Content.asp',
          },
        ],
      },
      {
        title: 'IPv6',
        icon: 'v6',
        tabs: [{ title: 'IPv6', href: '/ipv6', asp: 'Advanced_IPv6_Content.asp' }],
      },
      {
        title: 'VPN',
        icon: 'vpn',
        tabs: [
          {
            title: 'VPN Server',
            href: '/vpn/vpn-server',
            asp: 'Advanced_VPNServer_Content.asp',
          },
          {
            title: 'VPN Fusion',
            href: '/vpn/vpn-fusion',
            asp: 'Advanced_VPNClient_Content.asp',
          },
          {
            title: 'Instant Guard',
            href: '/vpn/instant-guard',
            asp: 'Advanced_Instant_Guard.asp',
          },
        ],
      },
      {
        title: 'Firewall',
        icon: 'fw',
        tabs: [
          {
            title: 'General',
            href: '/firewall/general',
            asp: 'Advanced_BasicFirewall_Content.asp',
          },
          {
            title: 'URL Filter',
            href: '/firewall/url-filter',
            asp: 'Advanced_URLFilter_Content.asp',
          },
          {
            title: 'Keyword Filter',
            href: '/firewall/keyword-filter',
            asp: 'Advanced_KeywordFilter_Content.asp',
          },
          {
            title: 'Network Services Filter',
            href: '/firewall/network-services-filter',
            asp: 'Advanced_Firewall_Content.asp',
          },
        ],
      },
      {
        title: 'Administration',
        icon: 'adm',
        tabs: [
          {
            title: 'Operation Mode',
            href: '/administration/operation-mode',
            asp: 'Advanced_OperationMode_Content.asp',
          },
          {
            title: 'System',
            href: '/administration/system',
            asp: 'Advanced_System_Content.asp',
          },
          {
            title: 'Firmware Upgrade',
            href: '/administration/firmware-upgrade',
            asp: 'Advanced_FirmwareUpgrade_Content.asp',
          },
          {
            title: 'Restore/Save/Upload Setting',
            href: '/administration/restore-save',
            asp: 'Advanced_SettingBackup_Content.asp',
          },
          {
            title: 'Feedback',
            href: '/administration/feedback',
            asp: 'Advanced_Feedback.asp',
          },
          {
            title: 'Policy',
            href: '/administration/policy',
            asp: 'Advanced_Privacy.asp',
          },
        ],
      },
      {
        title: 'System Log',
        icon: 'log',
        tabs: [
          {
            title: 'General Log',
            href: '/system-log/general',
            asp: 'Main_LogStatus_Content.asp',
          },
          {
            title: 'Wireless Log',
            href: '/system-log/wireless',
            asp: 'Main_WStatus_Content.asp',
          },
          {
            title: 'DHCP leases',
            href: '/system-log/dhcp-leases',
            asp: 'Main_DHCPStatus_Content.asp',
          },
          {
            title: 'IPv6',
            href: '/system-log/ipv6',
            asp: 'Main_IPV6Status_Content.asp',
          },
          {
            title: 'Routing Table',
            href: '/system-log/routing-table',
            asp: 'Main_RouteStatus_Content.asp',
          },
          {
            title: 'Port Forwarding',
            href: '/system-log/port-forwarding',
            asp: 'Main_IPTStatus_Content.asp',
          },
          {
            title: 'Connections',
            href: '/system-log/connections',
            asp: 'Main_ConnStatus_Content.asp',
          },
          {
            title: 'Security Update Notification',
            href: '/system-log/security-update',
            asp: 'Main_Security_Change_Notification.asp',
          },
        ],
      },
      {
        title: 'Network Tools',
        icon: 'tools',
        tabs: [
          {
            title: 'Network Analysis',
            href: '/network-tools/network-analysis',
            asp: 'Main_Analysis_Content.asp',
          },
          {
            title: 'Netstat',
            href: '/network-tools/netstat',
            asp: 'Main_Netstat_Content.asp',
          },
          {
            title: 'Wake on LAN',
            href: '/network-tools/wake-on-lan',
            asp: 'Main_WOL_Content.asp',
          },
        ],
      },
    ],
  },
  {
    split: 'Справочник',
    items: [
      {
        title: 'Приватность и безопасность',
        icon: 'shield',
        tabs: [{ title: 'Чеклист', href: '/checklist' }],
      },
    ],
  },
]

export type Location = {
  group: MenuGroup
  item: MenuItem
  tab: Tab
}

export const allTabs: Array<Location> = menu.flatMap((group) =>
  group.items.flatMap((item) => item.tabs.map((tab) => ({ group, item, tab }))),
)

export function locate(pathname: string): Location | undefined {
  let path = pathname.replace(/\/$/, '') || '/'
  return allTabs.find((l) => l.tab.href === path)
}

// The heading the router prints at the top of a tab: "Wireless - General".
export function formTitle({ item, tab }: Location) {
  return item.tabs.length === 1 ? item.title : `${item.title} - ${tab.title}`
}
