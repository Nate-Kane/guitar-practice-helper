import { FC, useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase'; // Adjust the path based on your Firebase setup
import styles from './AdminPage.module.css';
import { getPractices, addPractice, deletePractice, updatePractice } from '../services/practiceService';
import { Practice } from '../types/practice';
// import { useNavigate } from 'react-router-dom';

const AdminPage: FC = () => {
    // const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [practices, setPractices] = useState<Practice[]>([]);
    const [isAddingPractice, setIsAddingPractice] = useState<boolean>(false);
    const [newPractice, setNewPractice] = useState<Omit<Practice, 'id'>>({
        title: '',
        description: '',
        skillLevels: ['basics'],
        customDirections: '',
        practiceTips: ''
    });
    const [editingPracticeId, setEditingPracticeId] = useState<string | null>(null);
    const [editedPractice, setEditedPractice] = useState<Omit<Practice, 'id'>>({
        title: '',
        description: '',
        skillLevels: ['basics'],
        customDirections: '',
        practiceTips: ''
    })


    const db = getFirestore(app);

    useEffect(() => {
        const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
        if (isAuth) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPractices();
        }
    }, [isAuthenticated]);

    const fetchPractices = async () => {
        setIsLoading(true);
        try {
            const practicesData = await getPractices();
            setPractices(practicesData);
        } catch (error) {
            console.error('Error fetching practices:', error);
            setError('Failed to load practices');
        } finally {
            setIsLoading(false);
        }
    };

    const checkPassword = async (inputPassword: string) => {
        setIsLoading(true);
        setError('');
        
        try {
            // Get the admin settings document
            const adminDoc = doc(db, 'admin', 'settings');
            const adminSnapshot = await getDoc(adminDoc);
            
            if (adminSnapshot.exists()) {
                const adminData = adminSnapshot.data();
                
                // Check if the password matches
                if (adminData.password === inputPassword) {
                    setIsAuthenticated(true);
                    localStorage.setItem('adminAuthenticated', 'true');
                } else {
                    setError('Incorrect password');
                }
            } else {
                setError('Admin settings not found');
            }
        } catch (error) {
            console.error('Error checking password:', error);
            setError('An error occurred while checking the password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        checkPassword(password);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('adminAuthenticated');
    };

    const handleAddPractice = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            await addPractice(newPractice);
            // Reset form and refresh practices
            setNewPractice({
                title: '',
                description: '',
                skillLevels: ['basics'],
                customDirections: '',
                practiceTips: ''
            });
            setIsAddingPractice(false);
            await fetchPractices();
        } catch (error) {
            console.error('Error adding practice:', error);
            setError('Failed to add practice');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditPractice = (practice: Practice) => {
        if (practice.id) {
            if (editingPracticeId === practice.id) {
                setEditingPracticeId(null);
            } else {
                setEditingPracticeId(practice.id);
                
                setEditedPractice({
                    title: practice.title,
                    description: practice.description,
                    skillLevels: practice.skillLevels,
                    customDirections: practice.customDirections || '',
                    practiceTips: practice.practiceTips || ''
                });
            }
        }
    }

    const handleEditSkillLevelToggle = (level: string) => {
        setEditedPractice(prev => {
          const updatedSkillLevels = prev.skillLevels.includes(level)
            ? prev.skillLevels.filter(l => l !== level)
            : [...prev.skillLevels, level];
          
          return {
            ...prev,
            skillLevels: updatedSkillLevels
          };
        });
      };

      const handleUpdatePractice = async (e: React.FormEvent, practiceId: string) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await updatePractice(practiceId, editedPractice);
            setEditingPracticeId(null);
            await fetchPractices();
        } catch {
            console.error('Error updating pracitce: ', error)
            setError('Failed to updated practice');
        } finally {
            setIsLoading(false);
        }
      }

    const handleDeletePractice = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this practice?')) {
            setIsLoading(true);
            try {
                await deletePractice(id);
                await fetchPractices();
            } catch (error) {
                console.error('Error deleting practice:', error);
                setError('Failed to delete practice');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSkillLevelToggle = (level: string) => {
        setNewPractice(prev => {
            const updatedSkillLevels = prev.skillLevels.includes(level)
                ? prev.skillLevels.filter(l => l !== level)
                : [...prev.skillLevels, level];
            
            return {
                ...prev,
                skillLevels: updatedSkillLevels
            };
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="container">
                <header className="header">
                    <h1>Admin Access</h1>
                </header>
                <div className={`card ${styles.authCard}`}>
                    <form onSubmit={handleLogin} className={styles.form}>
                        <div className={styles.formGroup}>
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className={`button button-secondary ${styles.loginButton}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Checking...' : 'Login'}
                        </button>
                    </form>
                    {error && <p className={styles.error}>{error}</p>}
                </div>
            </div>
        );
    } else {
        return (
            <div className="container">
                <header className={`header ${styles.adminHeader}`}>
                    <button onClick={handleLogout} className={`button button-secondary ${styles.leftButton}`}>
                        Logout
                    </button>
                    <h1>Admin Dashboard</h1>
                    <div></div>
                </header>

                <div className={styles.practiceManagement}>
                    <div className={styles.headerActions}>
                        <h2>Practice Management</h2>
                        <button 
                            className="button button-primary"
                            onClick={() => setIsAddingPractice(!isAddingPractice)}
                        >
                            {isAddingPractice ? 'Cancel' : 'Add New Practice'}
                        </button>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}
                </div>

                {isAddingPractice && (
                    <div className={`card ${styles.addPracticeForm}`}>
                        <h3>Add New Practice</h3>
                        <form onSubmit={handleAddPractice}>
                            <div className={styles.formRow}>
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={newPractice.title}
                                    onChange={(e) => setNewPractice({...newPractice, title: e.target.value})}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formRow}>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    value={newPractice.description}
                                    onChange={(e) => setNewPractice({...newPractice, description: e.target.value})}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formRow}>
                                <label>Skill Levels</label>
                                <div className={styles.checkboxGroup}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={newPractice.skillLevels.includes('basics')}
                                            onChange={() => handleSkillLevelToggle('basics')}
                                        />
                                        basics
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={newPractice.skillLevels.includes('intermediate')}
                                            onChange={() => handleSkillLevelToggle('intermediate')}
                                        />
                                        Intermediate
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={newPractice.skillLevels.includes('advanced')}
                                            onChange={() => handleSkillLevelToggle('advanced')}
                                        />
                                        Advanced
                                    </label>
                                </div>
                            </div>
                            
                            
                            <div className={styles.formRow}>
                                <label htmlFor="customDirections">Custom Directions</label>
                                <textarea
                                    id="customDirections"
                                    value={newPractice.customDirections || ''}
                                    onChange={(e) => setNewPractice({...newPractice, customDirections: e.target.value})}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <label htmlFor="practiceTips">Practice Tips</label>
                                <textarea
                                    id="practiceTips"
                                    value={newPractice.practiceTips || ''}
                                    onChange={(e) => setNewPractice({...newPractice, practiceTips: e.target.value})}
                                />
                            </div>
                            
                            <div className={styles.formActions}>
                                <button 
                                    type="submit" 
                                    className="button button-secondary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Adding...' : 'Add Practice'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {isLoading && !isAddingPractice ? (
                    <div className="loading-message">Loading practices...</div>
                ) : (
                    <div className={styles.practiceListContainer}>
                        {practices.length === 0 ? (
                            <p>No practices available. Add your first practice!</p>
                        ) : (
                            practices.map(practice => (
                                <div key={practice.id} className={`card ${styles.practiceItem}`}>
                                    {editingPracticeId !== practice.id && (
                                        <div className={styles.practiceInfo}>
                                            <div>
                                                <h3>{practice.title}</h3>
                                                <p className={styles.skillLevels}>
                                                    {practice.skillLevels.map(level => level.charAt(0).toUpperCase() + level.slice(1)).join(', ')}
                                                </p>
                                            </div>
                                            <div className={styles.practiceActions}>
                                                <button 
                                                    className="button button-secondary"
                                                    onClick={() => handleEditPractice(practice)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="button button-danger"
                                                    onClick={() => practice.id && handleDeletePractice(practice.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    
                                    {editingPracticeId === practice.id && (
                                        <div className={styles.editPracticeForm}>
                                        <h4>Edit Practice</h4>
                                        <form onSubmit={(e) => {
                                            if (practice.id) {
                                                handleUpdatePractice(e, practice.id)}
                                            }
                                        }>
                                          <div className={styles.formRow}>
                                            <label htmlFor={`title-${practice.id}`}>Title</label>
                                            <input
                                              type="text"
                                              id={`title-${practice.id}`}
                                              value={editedPractice.title}
                                              onChange={(e) => setEditedPractice({...editedPractice, title: e.target.value})}
                                              required
                                            />
                                          </div>
                                          
                                          <div className={styles.formRow}>
                                            <label htmlFor={`description-${practice.id}`}>Description</label>
                                            <textarea
                                              id={`description-${practice.id}`}
                                              value={editedPractice.description}
                                              onChange={(e) => setEditedPractice({...editedPractice, description: e.target.value})}
                                              required
                                            />
                                          </div>
                                          
                                          <div className={styles.formRow}>
                                            <label>Skill Levels</label>
                                            <div className={styles.checkboxGroup}>
                                              <label>
                                                <input
                                                  type="checkbox"
                                                  checked={editedPractice.skillLevels.includes('basics')}
                                                  onChange={() => handleEditSkillLevelToggle('basics')}
                                                />
                                                basics
                                              </label>
                                              <label>
                                                <input
                                                  type="checkbox"
                                                  checked={editedPractice.skillLevels.includes('intermediate')}
                                                  onChange={() => handleEditSkillLevelToggle('intermediate')}
                                                />
                                                Intermediate
                                              </label>
                                              <label>
                                                <input
                                                  type="checkbox"
                                                  checked={editedPractice.skillLevels.includes('advanced')}
                                                  onChange={() => handleEditSkillLevelToggle('advanced')}
                                                />
                                                Advanced
                                              </label>
                                            </div>
                                          </div>
                                          
                                          <div className={styles.formRow}>
                                            <label htmlFor={`customDirections-${practice.id}`}>Custom Directions</label>
                                            <textarea
                                              id={`customDirections-${practice.id}`}
                                              value={editedPractice.customDirections || ''}
                                              onChange={(e) => setEditedPractice({...editedPractice, customDirections: e.target.value})}
                                            />
                                          </div>
                                  
                                          <div className={styles.formRow}>
                                            <label htmlFor={`practiceTips-${practice.id}`}>Practice Tips</label>
                                            <textarea
                                              id={`practiceTips-${practice.id}`}
                                              value={editedPractice.practiceTips || ''}
                                              onChange={(e) => setEditedPractice({...editedPractice, practiceTips: e.target.value})}
                                            />
                                          </div>
                                          
                                          <div className={styles.formActions}>
                                            <button 
                                              type="submit" 
                                              className="button button-primary"
                                              disabled={isLoading}
                                            >
                                              {isLoading ? 'Updating...' : 'Update Practice'}
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default AdminPage;