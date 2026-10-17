// Terms shown with a dotted underline and a tooltip: <T>SSID</T>.
// Keep each entry to one plain sentence; the depth lives in the "Related" links.
export const glossary: Record<string, { full: string; plain: string }> = {
  SSID: {
    full: 'Service Set Identifier',
    plain: 'имя Wi‑Fi сети, которое вы видите в списке на телефоне',
  },
  WPS: {
    full: 'Wi‑Fi Protected Setup',
    plain: 'подключение к Wi‑Fi кнопкой или 8‑значным PIN без ввода пароля',
  },
  PIN: {
    full: 'Personal Identification Number',
    plain: 'короткий цифровой код',
  },
  WPA2: {
    full: 'Wi‑Fi Protected Access 2',
    plain: 'стандарт шифрования Wi‑Fi, который понимают почти все устройства',
  },
  WPA3: {
    full: 'Wi‑Fi Protected Access 3',
    plain: 'новый стандарт шифрования Wi‑Fi; защищает лучше, но старые устройства его не понимают',
  },
  AES: {
    full: 'Advanced Encryption Standard',
    plain: 'алгоритм шифрования, которым защищён трафик Wi‑Fi',
  },
  DFS: {
    full: 'Dynamic Frequency Selection',
    plain: 'правило, по которому Wi‑Fi обязан освобождать каналы, если рядом работает радар',
  },
  MLO: {
    full: 'Multi‑Link Operation',
    plain: 'возможность Wi‑Fi 7 использовать 2,4 и 5 ГГц одновременно',
  },
  PMF: {
    full: 'Protected Management Frames',
    plain: 'защита служебных сообщений Wi‑Fi от подделки (стандарт 802.11w)',
  },
  DHCP: {
    full: 'Dynamic Host Configuration Protocol',
    plain: 'служба, которая выдаёт устройствам адреса в сети',
  },
  DNS: {
    full: 'Domain Name System',
    plain: '«телефонная книга» интернета: превращает имя сайта в адрес',
  },
  NAT: {
    full: 'Network Address Translation',
    plain: 'способ, которым много устройств дома выходят в интернет под одним адресом',
  },
  RADIUS: {
    full: 'Remote Authentication Dial-In User Service',
    plain: 'сервер учётных записей в офисных сетях; дома не нужен',
  },
  RSSI: {
    full: 'Received Signal Strength Indicator',
    plain: 'уровень сигнала, с которым устройство слышит роутер',
  },
}
