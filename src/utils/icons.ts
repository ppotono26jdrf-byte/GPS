import L from 'leaflet'

export function createDeviceIcon(online: boolean, selected: boolean): L.DivIcon {
  const color = online ? '#22c55e' : '#94a3b8'
  const classes = [
    'device-marker__dot',
    selected ? 'is-selected' : '',
    online ? '' : 'is-offline',
  ]
    .filter(Boolean)
    .join(' ')

  return L.divIcon({
    className: 'device-marker',
    html: `<span class="${classes}" style="--device-color:${color}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  })
}
