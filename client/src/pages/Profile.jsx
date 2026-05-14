import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { User, Moon, Sun, LogOut, Edit2 } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export function Profile() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: '', email: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const res = await api.get('/auth/user');
            setUser({ name: res.data.name, email: res.data.email });
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/auth/user', formData);
            setUser({ name: res.data.name, email: res.data.email });
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    const openModal = () => {
        setFormData({ name: user.name, email: user.email });
        setIsModalOpen(true);
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Profile & Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="space-y-6">
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <User size={20} /> Personal Information
                        </h2>
                        <Button variant="ghost" size="sm" onClick={openModal}>
                            <Edit2 size={16} className="mr-2" /> Edit
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-3xl font-bold uppercase">
                            {user.name.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user.name || 'User'}</h3>
                            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                            <p className="text-xs text-primary-500 mt-1 font-medium">Premium Member</p>
                        </div>
                    </div>
                </Card>

                <Card className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Preferences</h2>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-3">
                            {theme === 'dark' ? <Moon size={24} className="text-primary-400" /> : <Sun size={24} className="text-amber-500" />}
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
                                <p className="text-sm text-gray-500">Toggle app theme</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                        <Button
                            variant="outline"
                            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 border-red-200 dark:border-red-900"
                            onClick={handleLogout}
                        >
                            <LogOut size={20} /> Log Out
                        </Button>
                    </div>
                </Card>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Profile">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
