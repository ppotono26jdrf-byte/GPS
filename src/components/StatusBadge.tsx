interface StatusBadgeProps {
  online: boolean
}

function StatusBadge({ online }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${online ? 'is-online' : 'is-offline'}`}>
      <span className="status-badge__dot" />
      {online ? 'En linea' : 'Desconectado'}
    </span>
  )
}

export default StatusBadge
