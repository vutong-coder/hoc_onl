import React, { useState } from 'react';
import WebAuthnRegistration from '../components/molecules/WebAuthnRegistration';
import { changePassword } from '../services/api/authApi';

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('security');
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        sms: false
    });
    const [privacy, setPrivacy] = useState({
        profileVisible: true,
        showEmail: false,
        showPhone: false
    });
    
    // Password change state
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const tabs = [
        { id: 'security', label: 'Bảo mật' },
        { id: 'profile', label: 'Hồ sơ' },
        { id: 'notifications', label: 'Thông báo' },
        { id: 'privacy', label: 'Quyền riêng tư' },
        { id: 'appearance', label: 'Giao diện' }
    ];

    // Password change handlers
    const handleOpenPasswordModal = () => {
        setShowPasswordModal(true);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
        setPasswordMessage(null);
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordErrors({});
        setPasswordMessage(null);
    };

    const validatePasswordForm = (): boolean => {
        const errors: typeof passwordErrors = {};
        
        if (!passwordData.currentPassword) {
            errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        }
        
        if (!passwordData.newPassword) {
            errors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (passwordData.newPassword.length < 6) {
            errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
        }
        
        if (!passwordData.confirmPassword) {
            errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }
        
        if (passwordData.currentPassword === passwordData.newPassword) {
            errors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
        }
        
        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async () => {
        if (!validatePasswordForm()) {
            return;
        }

        setIsChangingPassword(true);
        setPasswordMessage(null);

        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
            setTimeout(() => {
                handleClosePasswordModal();
            }, 2000);
        } catch (error: any) {
            setPasswordMessage({ 
                type: 'error', 
                text: error.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.' 
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const renderSecurityTab = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Password Section */}
            <div style={{
                background: 'var(--card)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)'
            }}>
                <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: 'var(--foreground)'
                }}>
                    Mật khẩu
                </h3>
                <p style={{ 
                    color: 'var(--muted-foreground)', 
                    marginBottom: '1rem',
                    fontSize: '0.875rem'
                }}>
                    Thay đổi mật khẩu để bảo vệ tài khoản của bạn
                </p>
                <button 
                    onClick={handleOpenPasswordModal}
                    style={{
                        background: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                    }}
                >
                    Đổi mật khẩu
                </button>
            </div>

            {/* WebAuthn Section */}
            <div style={{
                background: 'var(--card)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)'
            }}>
                <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: 'var(--foreground)'
                }}>
                    Xác thực sinh trắc học
                </h3>
                <WebAuthnRegistration />
            </div>

            {/* Two-Factor Authentication */}
            <div style={{
                background: 'var(--card)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)'
            }}>
                <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: 'var(--foreground)'
                }}>
                    Xác thực hai yếu tố (2FA)
                </h3>
                <p style={{ 
                    color: 'var(--muted-foreground)', 
                    marginBottom: '1rem',
                    fontSize: '0.875rem'
                }}>
                    Thêm lớp bảo mật bổ sung cho tài khoản của bạn
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button style={{
                        background: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        border: '1px solid var(--border)',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}>
                        Cài đặt SMS
                    </button>
                    <button style={{
                        background: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        border: '1px solid var(--border)',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}>
                        Cài đặt Email
                    </button>
                </div>
            </div>
        </div>
    );

    const renderProfileTab = () => (
        <div style={{
            background: 'var(--card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)'
        }}>
            <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                color: 'var(--foreground)'
            }}>
                Thông tin cá nhân
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        color: 'var(--foreground)'
                    }}>
                        Họ và tên
                    </label>
                    <input 
                        type="text" 
                        placeholder="Nhập họ và tên"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--background)',
                            color: 'var(--foreground)',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        color: 'var(--foreground)'
                    }}>
                        Email
                    </label>
                    <input 
                        type="email" 
                        placeholder="example@email.com"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--background)',
                            color: 'var(--foreground)',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <div>
                    <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        color: 'var(--foreground)'
                    }}>
                        Số điện thoại
                    </label>
                    <input 
                        type="tel" 
                        placeholder="+84 xxx xxx xxx"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--background)',
                            color: 'var(--foreground)',
                            fontSize: '0.875rem'
                        }}
                    />
                </div>
                <button style={{
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginTop: '1rem',
                    alignSelf: 'flex-start'
                }}>
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div style={{
            background: 'var(--card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)'
        }}>
            <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                color: 'var(--foreground)'
            }}>
                Cài đặt thông báo
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--background)'
                    }}>
                        <div>
                            <h4 style={{ 
                                fontSize: '0.875rem', 
                                fontWeight: '500',
                                marginBottom: '0.25rem',
                                color: 'var(--foreground)'
                            }}>
                                {key === 'email' ? 'Thông báo Email' : 
                                 key === 'push' ? 'Thông báo đẩy' : 'Thông báo SMS'}
                            </h4>
                            <p style={{ 
                                fontSize: '0.75rem', 
                                color: 'var(--muted-foreground)',
                                margin: 0
                            }}>
                                {key === 'email' ? 'Nhận thông báo qua email' : 
                                 key === 'push' ? 'Nhận thông báo trên trình duyệt' : 'Nhận thông báo qua SMS'}
                            </p>
                        </div>
                        <label style={{
                            position: 'relative',
                            display: 'inline-block',
                            width: '44px',
                            height: '24px'
                        }}>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setNotifications(prev => ({
                                    ...prev,
                                    [key]: e.target.checked
                                }))}
                                style={{ display: 'none' }}
                            />
                            <span style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: value ? 'var(--primary)' : 'var(--muted)',
                                transition: '0.4s',
                                borderRadius: '24px'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    content: '',
                                    height: '18px',
                                    width: '18px',
                                    left: value ? '23px' : '3px',
                                    bottom: '3px',
                                    backgroundColor: 'white',
                                    transition: '0.4s',
                                    borderRadius: '50%'
                                }} />
                            </span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPrivacyTab = () => (
        <div style={{
            background: 'var(--card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)'
        }}>
            <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                color: 'var(--foreground)'
            }}>
                Quyền riêng tư
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(privacy).map(([key, value]) => (
                    <div key={key} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--background)'
                    }}>
                        <div>
                            <h4 style={{ 
                                fontSize: '0.875rem', 
                                fontWeight: '500',
                                marginBottom: '0.25rem',
                                color: 'var(--foreground)'
                            }}>
                                {key === 'profileVisible' ? 'Hiển thị hồ sơ công khai' : 
                                 key === 'showEmail' ? 'Hiển thị email' : 'Hiển thị số điện thoại'}
                            </h4>
                            <p style={{ 
                                fontSize: '0.75rem', 
                                color: 'var(--muted-foreground)',
                                margin: 0
                            }}>
                                {key === 'profileVisible' ? 'Cho phép người khác xem hồ sơ của bạn' : 
                                 key === 'showEmail' ? 'Hiển thị email trong hồ sơ công khai' : 'Hiển thị số điện thoại trong hồ sơ công khai'}
                            </p>
                        </div>
                        <label style={{
                            position: 'relative',
                            display: 'inline-block',
                            width: '44px',
                            height: '24px'
                        }}>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setPrivacy(prev => ({
                                    ...prev,
                                    [key]: e.target.checked
                                }))}
                                style={{ display: 'none' }}
                            />
                            <span style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: value ? 'var(--primary)' : 'var(--muted)',
                                transition: '0.4s',
                                borderRadius: '24px'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    content: '',
                                    height: '18px',
                                    width: '18px',
                                    left: value ? '23px' : '3px',
                                    bottom: '3px',
                                    backgroundColor: 'white',
                                    transition: '0.4s',
                                    borderRadius: '50%'
                                }} />
                            </span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAppearanceTab = () => (
        <div style={{
            background: 'var(--card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)'
        }}>
            <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '1.5rem',
                color: 'var(--foreground)'
            }}>
                Giao diện
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <h4 style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500',
                        marginBottom: '1rem',
                        color: 'var(--foreground)'
                    }}>
                        Chế độ hiển thị
                    </h4>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {['Sáng', 'Tối', 'Tự động'].map((theme) => (
                            <button key={theme} style={{
                                padding: '0.75rem 1.5rem',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                background: theme === 'Tối' ? 'var(--primary)' : 'var(--background)',
                                color: theme === 'Tối' ? 'var(--primary-foreground)' : 'var(--foreground)',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}>
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '500',
                        marginBottom: '1rem',
                        color: 'var(--foreground)'
                    }}>
                        Ngôn ngữ
                    </h4>
                    <select style={{
                        padding: '0.75rem',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--background)',
                        color: 'var(--foreground)',
                        fontSize: '0.875rem',
                        minWidth: '200px'
                    }}>
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'security': return renderSecurityTab();
            case 'profile': return renderProfileTab();
            case 'notifications': return renderNotificationsTab();
            case 'privacy': return renderPrivacyTab();
            case 'appearance': return renderAppearanceTab();
            default: return renderSecurityTab();
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--background)',
            padding: '2rem 1rem'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: 'var(--foreground)',
                        marginBottom: '0.5rem'
                    }}>
                        Cài đặt tài khoản
                    </h1>
                    <p style={{
                        color: 'var(--muted-foreground)',
                        fontSize: '1rem'
                    }}>
                        Quản lý thông tin cá nhân và tùy chỉnh trải nghiệm của bạn
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(250px, 300px) 1fr',
                    gap: '2rem',
                    alignItems: 'flex-start'
                }}>
                    {/* Sidebar */}
                    <div style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border)',
                        padding: '1rem',
                        position: 'sticky',
                        top: '2rem'
                    }}>
                        <nav>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        border: 'none',
                                        borderRadius: 'var(--radius-md)',
                                        background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                                        color: activeTab === tab.id ? 'var(--primary-foreground)' : 'var(--foreground)',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        marginBottom: '0.25rem',
                                        textAlign: 'left'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeTab !== tab.id) {
                                            e.currentTarget.style.background = 'var(--muted)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeTab !== tab.id) {
                                            e.currentTarget.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div>
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={handleClosePasswordModal}>
                    <div style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%',
                        border: '1px solid var(--border)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                    }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            marginBottom: '1.5rem',
                            color: 'var(--foreground)'
                        }}>
                            Đổi mật khẩu
                        </h2>

                        {passwordMessage && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1rem',
                                background: passwordMessage.type === 'success' 
                                    ? 'rgba(34, 197, 94, 0.1)' 
                                    : 'rgba(239, 68, 68, 0.1)',
                                color: passwordMessage.type === 'success'
                                    ? 'rgb(34, 197, 94)'
                                    : 'rgb(239, 68, 68)',
                                fontSize: '0.875rem'
                            }}>
                                {passwordMessage.text}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem',
                                    color: 'var(--foreground)'
                                }}>
                                    Mật khẩu hiện tại
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: `1px solid ${passwordErrors.currentPassword ? 'rgb(239, 68, 68)' : 'var(--border)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--background)',
                                        color: 'var(--foreground)',
                                        fontSize: '0.875rem'
                                    }}
                                />
                                {passwordErrors.currentPassword && (
                                    <p style={{
                                        color: 'rgb(239, 68, 68)',
                                        fontSize: '0.75rem',
                                        marginTop: '0.25rem',
                                        margin: 0
                                    }}>
                                        {passwordErrors.currentPassword}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem',
                                    color: 'var(--foreground)'
                                }}>
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: `1px solid ${passwordErrors.newPassword ? 'rgb(239, 68, 68)' : 'var(--border)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--background)',
                                        color: 'var(--foreground)',
                                        fontSize: '0.875rem'
                                    }}
                                />
                                {passwordErrors.newPassword && (
                                    <p style={{
                                        color: 'rgb(239, 68, 68)',
                                        fontSize: '0.75rem',
                                        marginTop: '0.25rem',
                                        margin: 0
                                    }}>
                                        {passwordErrors.newPassword}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem',
                                    color: 'var(--foreground)'
                                }}>
                                    Xác nhận mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="Nhập lại mật khẩu mới"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: `1px solid ${passwordErrors.confirmPassword ? 'rgb(239, 68, 68)' : 'var(--border)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--background)',
                                        color: 'var(--foreground)',
                                        fontSize: '0.875rem'
                                    }}
                                />
                                {passwordErrors.confirmPassword && (
                                    <p style={{
                                        color: 'rgb(239, 68, 68)',
                                        fontSize: '0.75rem',
                                        marginTop: '0.25rem',
                                        margin: 0
                                    }}>
                                        {passwordErrors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            marginTop: '1.5rem',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={handleClosePasswordModal}
                                disabled={isChangingPassword}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--background)',
                                    color: 'var(--foreground)',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    cursor: isChangingPassword ? 'not-allowed' : 'pointer',
                                    opacity: isChangingPassword ? 0.5 : 1
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleChangePassword}
                                disabled={isChangingPassword}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--primary)',
                                    color: 'var(--primary-foreground)',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    cursor: isChangingPassword ? 'not-allowed' : 'pointer',
                                    opacity: isChangingPassword ? 0.5 : 1
                                }}
                            >
                                {isChangingPassword ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;