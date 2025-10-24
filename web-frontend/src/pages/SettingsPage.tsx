import React, { useState } from 'react';
import SettingsSidebar from '../components/sections/SettingsSidebar';
import AccountSettings from '../components/sections/AccountSettings';
import { mockUserSettings, settingsNavItems } from '../data/mockSettings';
import { UserSettings, SettingsNavItem as SettingsNavItemType } from '../types/settings';

export default function SettingsPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('account');
  const [settings, setSettings] = useState<UserSettings>(mockUserSettings);

  const handleNavItemClick = (itemId: string) => {
    setActiveTab(itemId);
  };

  const handleSaveChanges = () => {
    // TODO: Implement save changes logic
    console.log('Saving settings:', settings);
    
    // Show success message
    alert('Settings saved successfully!');
  };

  const handleUpdateAccountSettings = (updatedAccountSettings: Partial<UserSettings['account']>) => {
    setSettings(prev => ({
      ...prev,
      account: {
        ...prev.account,
        ...updatedAccountSettings
      }
    }));
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <AccountSettings
            settings={settings.account}
            onUpdateSettings={handleUpdateAccountSettings}
          />
        );
      
      case 'password':
        return (
          <div style={{
            padding: '24px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              margin: '0 0 16px 0',
              color: 'var(--foreground)'
            }}>
              Password Settings
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--muted-foreground)',
              margin: 0
            }}>
              Password management functionality will be implemented here.
            </p>
          </div>
        );
      
      case 'teams':
        return (
          <div style={{
            padding: '24px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              margin: '0 0 16px 0',
              color: 'var(--foreground)'
            }}>
              Team Settings
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--muted-foreground)',
              margin: 0
            }}>
              Team management functionality will be implemented here.
            </p>
          </div>
        );
      
      case 'subscriptions':
        return (
          <div style={{
            padding: '24px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              margin: '0 0 16px 0',
              color: 'var(--foreground)'
            }}>
              Subscription Settings
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--muted-foreground)',
              margin: 0
            }}>
              Subscription management functionality will be implemented here.
            </p>
          </div>
        );
      
      case 'shipping':
        return (
          <div style={{
            padding: '24px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              margin: '0 0 16px 0',
              color: 'var(--foreground)'
            }}>
              Shipping Details
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--muted-foreground)',
              margin: 0
            }}>
              Shipping information management will be implemented here.
            </p>
          </div>
        );
      
      case 'emails':
        return (
          <div style={{
            padding: '24px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              margin: '0 0 16px 0',
              color: 'var(--foreground)'
            }}>
              Email Preferences
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--muted-foreground)',
              margin: 0
            }}>
              Email notification preferences will be implemented here.
            </p>
          </div>
        );
      
      case 'language':
        return (
          <div style={{
            padding: '24px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              margin: '0 0 16px 0',
              color: 'var(--foreground)'
            }}>
              Language Settings
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--muted-foreground)',
              margin: 0
            }}>
              Language and localization settings will be implemented here.
            </p>
          </div>
        );
      
      case 'personalization':
        return (
          <div style={{
            padding: '24px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              margin: '0 0 16px 0',
              color: 'var(--foreground)'
            }}>
              Personalization
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--muted-foreground)',
              margin: 0
            }}>
              Personalization and theme settings will be implemented here.
            </p>
          </div>
        );
      
      default:
        return (
          <div style={{
            padding: '24px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 600,
              margin: '0 0 16px 0',
              color: 'var(--foreground)'
            }}>
              Settings
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'var(--muted-foreground)',
              margin: 0
            }}>
              Select a setting category from the sidebar to get started.
            </p>
          </div>
        );
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      color: 'var(--foreground)',
      fontFamily: 'var(--font-sans)',
      width: '100%',
      boxSizing: 'border-box',
      paddingTop: '80px' // Thêm padding để tránh header overlap
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '24px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Page Header */}
        <div style={{
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 800,
            margin: '0 0 8px 0',
            color: 'var(--foreground)',
            background: 'linear-gradient(135deg, var(--foreground) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Settings
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--muted-foreground)',
            margin: 0
          }}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px minmax(0, 1fr)', // Sử dụng minmax để tránh overflow
          gap: '40px',
          alignItems: 'start',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Left Sidebar */}
          <SettingsSidebar
            navItems={settingsNavItems}
            activeItemId={activeTab}
            onNavItemClick={handleNavItemClick}
            onSaveChanges={handleSaveChanges}
          />

          {/* Right Content Area */}
          <div style={{
            minHeight: '600px',
            position: 'relative',
            zIndex: 1,
            paddingBottom: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
            minWidth: 0, // Cho phép shrink khi cần
            boxSizing: 'border-box'
          }}>
            {renderActiveTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
