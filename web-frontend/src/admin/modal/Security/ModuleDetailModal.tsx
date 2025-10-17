import React from 'react'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import { Shield, Activity, TrendingUp, Clock, Database, Cpu, HardDrive } from 'lucide-react'

interface ModuleDetailModalProps {
	isOpen: boolean
	onClose: () => void
	module: any
}

const ModuleDetailModal: React.FC<ModuleDetailModalProps> = ({
	isOpen,
	onClose,
	module
}) => {
	if (!module) return null

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'success'
			case 'warning': return 'warning'
			case 'error': return 'danger'
			case 'maintenance': return 'secondary'
			case 'offline': return 'danger'
			default: return 'secondary'
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'active': return <Shield size={16} />
			case 'warning': return <Activity size={16} />
			case 'error': return <Activity size={16} />
			case 'maintenance': return <Clock size={16} />
			case 'offline': return <Activity size={16} />
			default: return <Activity size={16} />
		}
	}

	const formatNumber = (num: number) => {
		return num.toLocaleString('vi-VN')
	}

	const formatBytes = (bytes: number) => {
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
		if (bytes === 0) return '0 Bytes'
		const i = Math.floor(Math.log(bytes) / Math.log(1024))
		return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Chi tiết Module: ${module.name}`}
			maxWidth="800px"
		>
			<div style={{ padding: '20px' }}>
				{/* Module Overview */}
				<div style={{ 
					display: 'grid', 
					gridTemplateColumns: '1fr 1fr', 
					gap: '20px', 
					marginBottom: '24px' 
				}}>
					<div>
						<label style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px', display: 'block' }}>
							Tên Module
						</label>
						<div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
							{module.name}
						</div>
						<div style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
							{module.description}
						</div>
					</div>
					
					<div>
						<label style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px', display: 'block' }}>
							Trạng thái
						</label>
						<Badge variant={getStatusColor(module.status)} style={{ fontSize: '14px', padding: '6px 12px' }}>
							{getStatusIcon(module.status)}
							<span style={{ marginLeft: '6px' }}>
								{module.status === 'active' ? 'Hoạt động' :
								 module.status === 'warning' ? 'Cảnh báo' :
								 module.status === 'error' ? 'Lỗi' :
								 module.status === 'maintenance' ? 'Bảo trì' :
								 module.status === 'offline' ? 'Offline' : module.status}
							</span>
						</Badge>
					</div>
				</div>

				{/* Performance Metrics */}
				<div style={{ marginBottom: '24px' }}>
					<h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
						<TrendingUp size={18} />
						Hiệu suất & Thống kê
					</h3>
					<div style={{ 
						display: 'grid', 
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
						gap: '16px' 
					}}>
						<div style={{ 
							padding: '16px', 
							background: 'var(--muted)', 
							borderRadius: 'var(--radius-md)' 
						}}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
								<Database size={16} color="var(--primary)" />
								<span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
									Điểm bảo mật
								</span>
							</div>
							<div style={{ fontSize: '20px', fontWeight: 700 }}>
								{module.securityScore}/100
							</div>
						</div>

						<div style={{ 
							padding: '16px', 
							background: 'var(--muted)', 
							borderRadius: 'var(--radius-md)' 
						}}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
								<Activity size={16} color="var(--success)" />
								<span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
									Giao dịch hôm nay
								</span>
							</div>
							<div style={{ fontSize: '20px', fontWeight: 700 }}>
								{formatNumber(module.todayTransactions)}
							</div>
						</div>

						<div style={{ 
							padding: '16px', 
							background: 'var(--muted)', 
							borderRadius: 'var(--radius-md)' 
						}}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
								<Clock size={16} color="var(--warning)" />
								<span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
									Thời gian hoạt động
								</span>
							</div>
							<div style={{ fontSize: '20px', fontWeight: 700 }}>
								{module.uptime}
							</div>
						</div>

						<div style={{ 
							padding: '16px', 
							background: 'var(--muted)', 
							borderRadius: 'var(--radius-md)' 
						}}>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
								<Cpu size={16} color="var(--info)" />
								<span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
									CPU Usage
								</span>
							</div>
							<div style={{ fontSize: '20px', fontWeight: 700 }}>
								{module.cpuUsage}%
							</div>
						</div>
					</div>
				</div>

				{/* Technical Details */}
				<div style={{ marginBottom: '24px' }}>
					<h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
						<HardDrive size={18} />
						Thông tin kỹ thuật
					</h3>
					<div style={{ 
						display: 'grid', 
						gridTemplateColumns: '1fr 1fr', 
						gap: '16px' 
					}}>
						<div>
							<label style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px', display: 'block' }}>
								Version
							</label>
							<div style={{ fontSize: '14px', fontWeight: 500 }}>
								{module.version}
							</div>
						</div>
						
						<div>
							<label style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px', display: 'block' }}>
								Memory Usage
							</label>
							<div style={{ fontSize: '14px', fontWeight: 500 }}>
								{formatBytes(module.memoryUsage)}
							</div>
						</div>
						
						<div>
							<label style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px', display: 'block' }}>
								Last Updated
							</label>
							<div style={{ fontSize: '14px', fontWeight: 500 }}>
								{new Date(module.lastUpdated).toLocaleString('vi-VN')}
							</div>
						</div>
						
						<div>
							<label style={{ fontSize: '12px', color: 'var(--muted-foreground)', marginBottom: '4px', display: 'block' }}>
								Environment
							</label>
							<div style={{ fontSize: '14px', fontWeight: 500 }}>
								{module.environment}
							</div>
						</div>
					</div>
				</div>

				{/* Dependencies */}
				{module.dependencies && module.dependencies.length > 0 && (
					<div>
						<h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
							Dependencies
						</h3>
						<div style={{ 
							padding: '12px', 
							background: 'var(--muted)', 
							borderRadius: 'var(--radius-md)',
							fontSize: '12px',
							fontFamily: 'monospace'
						}}>
							{module.dependencies.map((dep: string, index: number) => (
								<div key={index} style={{ marginBottom: '4px' }}>
									{dep}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</Modal>
	)
}

export default ModuleDetailModal
