import { FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebase';
import styles from './AdminPage.module.css';
import { getPractices, addPractice, deletePractice, updatePractice } from '../services/practiceService';
import { Practice } from '../types/practice';

const BTN_PRIMARY =
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors shadow h-9 px-4 text-stone-50 bg-amber-900 hover:bg-amber-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

const BTN_SECONDARY =
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-9 px-4 border border-amber-900/30 text-amber-900 bg-white hover:bg-amber-100 cursor-pointer disabled:opacity-50';

const BTN_GHOST_ON_DARK =
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-9 px-4 border border-stone-50/25 text-stone-50 bg-stone-50/5 hover:bg-stone-50/10 cursor-pointer disabled:opacity-50';

const BTN_DANGER =
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors h-9 px-4 text-stone-50 bg-red-700 hover:bg-red-800 cursor-pointer disabled:opacity-50';

const INPUT_LIGHT =
  'w-full rounded-lg border border-amber-900/30 bg-white px-3 py-2 text-sm text-amber-900 placeholder:text-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-900/30';

const INPUT_DARK =
  'w-full rounded-lg border border-stone-50/25 bg-stone-50/5 px-3 py-2 text-sm text-stone-50 placeholder:text-stone-50/40 focus:outline-none focus:ring-2 focus:ring-stone-50/30';

const TEXTAREA_LIGHT = `${INPUT_LIGHT} min-h-[100px] resize-y`;

const TEXTAREA_DARK = `${INPUT_DARK} min-h-[100px] resize-y`;

const LABEL_LIGHT = 'block text-sm font-semibold text-amber-900 mb-1.5';

const LABEL_DARK = 'block text-sm font-semibold text-stone-50 mb-1.5';

const emptyPractice = (): Omit<Practice, 'id'> => ({
  title: '',
  description: '',
  skillLevels: ['basics'],
  customDirections: '',
  practiceTips: [],
});

const AdminPage: FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [isAddingPractice, setIsAddingPractice] = useState<boolean>(false);
  const [newPractice, setNewPractice] = useState<Omit<Practice, 'id'>>(emptyPractice());
  const [editingPracticeId, setEditingPracticeId] = useState<string | null>(null);
  const [editedPractice, setEditedPractice] = useState<Omit<Practice, 'id'>>(emptyPractice());
  const [newTip, setNewTip] = useState<string>('');
  const [editingTip, setEditingTip] = useState<string>('');

  const db = getFirestore(app);

  useEffect(() => {
    if (localStorage.getItem('adminAuthenticated') === 'true') {
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
    } catch (err) {
      console.error('Error fetching practices:', err);
      setError('Failed to load practices');
    } finally {
      setIsLoading(false);
    }
  };

  const checkPassword = async (inputPassword: string) => {
    setIsLoading(true);
    setError('');

    try {
      const adminDoc = doc(db, 'admin', 'settings');
      const adminSnapshot = await getDoc(adminDoc);

      if (adminSnapshot.exists()) {
        const adminData = adminSnapshot.data();
        if (adminData.password === inputPassword) {
          setIsAuthenticated(true);
          localStorage.setItem('adminAuthenticated', 'true');
        } else {
          setError('Incorrect password');
        }
      } else {
        setError('Admin settings not found');
      }
    } catch (err) {
      console.error('Error checking password:', err);
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
      setNewPractice(emptyPractice());
      setIsAddingPractice(false);
      await fetchPractices();
    } catch (err) {
      console.error('Error adding practice:', err);
      setError('Failed to add practice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPractice = (practice: Practice) => {
    if (!practice.id) return;
    if (editingPracticeId === practice.id) {
      setEditingPracticeId(null);
      return;
    }
    setEditingPracticeId(practice.id);
    setEditedPractice({
      title: practice.title,
      description: practice.description,
      skillLevels: practice.skillLevels,
      customDirections: practice.customDirections || '',
      practiceTips: Array.isArray(practice.practiceTips) ? practice.practiceTips : [],
    });
  };

  const handleEditSkillLevelToggle = (level: string) => {
    setEditedPractice((prev) => ({
      ...prev,
      skillLevels: prev.skillLevels.includes(level)
        ? prev.skillLevels.filter((l) => l !== level)
        : [...prev.skillLevels, level],
    }));
  };

  const handleUpdatePractice = async (e: React.FormEvent, practiceId: string) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updatePractice(practiceId, editedPractice);
      setEditingPracticeId(null);
      await fetchPractices();
    } catch (err) {
      console.error('Error updating practice:', err);
      setError('Failed to update practice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePractice = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this practice?')) return;
    setIsLoading(true);
    try {
      await deletePractice(id);
      await fetchPractices();
    } catch (err) {
      console.error('Error deleting practice:', err);
      setError('Failed to delete practice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkillLevelToggle = (level: string) => {
    setNewPractice((prev) => ({
      ...prev,
      skillLevels: prev.skillLevels.includes(level)
        ? prev.skillLevels.filter((l) => l !== level)
        : [...prev.skillLevels, level],
    }));
  };

  const handleAddTip = () => {
    if (!newTip.trim()) return;
    setNewPractice((prev) => ({
      ...prev,
      practiceTips: [...(prev.practiceTips || []), newTip.trim()],
    }));
    setNewTip('');
  };

  const handleRemoveTip = (index: number) => {
    setNewPractice((prev) => ({
      ...prev,
      practiceTips: prev.practiceTips?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleRemoveEditTip = (index: number) => {
    setEditedPractice((prev) => ({
      ...prev,
      practiceTips: prev.practiceTips?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleAddEditTip = () => {
    if (!editingTip.trim()) return;
    setEditedPractice((prev) => ({
      ...prev,
      practiceTips: [...(prev.practiceTips || []), editingTip.trim()],
    }));
    setEditingTip('');
  };

  const renderSkillLevels = (
    levels: string[],
    onToggle: (level: string) => void,
    variant: 'light' | 'dark'
  ) => (
    <div className="flex flex-wrap gap-4">
      {(['basics', 'intermediate', 'advanced'] as const).map((level) => (
        <label
          key={level}
          className={`flex items-center gap-2 cursor-pointer text-sm capitalize ${
            variant === 'dark' ? 'text-stone-50' : 'text-amber-900'
          }`}
        >
          <input
            type="checkbox"
            checked={levels.includes(level)}
            onChange={() => onToggle(level)}
            className="rounded border-amber-900/40 text-amber-900 focus:ring-amber-900/30"
          />
          {level}
        </label>
      ))}
    </div>
  );

  const renderTipsEditor = (
    tips: string[] | undefined,
    tipInput: string,
    setTipInput: (v: string) => void,
    onAdd: () => void,
    onRemove: (index: number) => void,
    variant: 'light' | 'dark'
  ) => (
    <div className="space-y-3">
      {tips?.map((tip, index) => (
        <div
          key={index}
          className={`flex items-start justify-between gap-3 rounded-lg px-3 py-2 ${
            variant === 'dark' ? 'bg-stone-50/10' : 'bg-amber-50'
          }`}
        >
          <span className={`text-sm flex-1 ${variant === 'dark' ? 'text-stone-50' : 'text-amber-900'}`}>
            {tip}
          </span>
          <button type="button" className={BTN_DANGER} onClick={() => onRemove(index)}>
            Remove
          </button>
        </div>
      ))}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={tipInput}
          onChange={(e) => setTipInput(e.target.value)}
          placeholder="Add a practice tip"
          className={variant === 'dark' ? INPUT_DARK : INPUT_LIGHT}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAdd())}
        />
        <button type="button" className={variant === 'dark' ? BTN_GHOST_ON_DARK : BTN_SECONDARY} onClick={onAdd}>
          Add Tip
        </button>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <main className={`flex-grow bg-stone-50 ${styles.adminShell}`}>
        <div className="mx-auto max-w-md px-4 py-12 md:py-16">
          <p className="text-center mb-6">
            <Link to="/" className="text-sm text-amber-900 hover:underline">
              ← Back to practices
            </Link>
          </p>
          <div className="rounded-lg bg-amber-900 text-stone-50 p-8 shadow-lg space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold">Admin</h1>
              <p className="text-stone-50/80 text-sm">Sign in to manage practices in Firebase</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-stone-50/25 bg-stone-50/10 px-3 py-2 text-stone-50 placeholder:text-stone-50/40 focus:outline-none focus:ring-2 focus:ring-stone-50/30"
                  required
                />
              </div>
              <button type="submit" className={`${BTN_PRIMARY} w-full`} disabled={isLoading}>
                {isLoading ? 'Checking...' : 'Sign in'}
              </button>
            </form>
            {error && <p className="text-red-300 text-sm font-medium text-center">{error}</p>}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-stone-50">
      <header className="bg-amber-900 text-stone-50 shadow-md">
        <div className="max-w-[1000px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="text-sm hover:text-amber-100 transition-colors shrink-0">
            ← Practices
          </Link>
          <h1 className="text-lg md:text-xl font-bold text-center">Admin Dashboard</h1>
          <button type="button" onClick={handleLogout} className={BTN_GHOST_ON_DARK}>
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1000px] px-4 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-amber-900">Practice Management</h2>
            <p className="text-amber-800/80 text-sm mt-1">
              Add and edit practices shown on the home page
            </p>
          </div>
          <button
            type="button"
            className={BTN_PRIMARY}
            onClick={() => setIsAddingPractice(!isAddingPractice)}
          >
            {isAddingPractice ? 'Cancel' : 'Add New Practice'}
          </button>
        </div>

        <div className="rounded-lg bg-amber-900 text-stone-50 p-6 text-sm leading-relaxed">
          <p className="font-semibold mb-2">Title must match a practice component in code:</p>
          <p className="text-stone-50/90">
            Sound Exploration, Fretboard Freedom, Fretboard Mapper, Memorize Notes
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm font-medium">
            {error}
          </p>
        )}

        {isAddingPractice && (
          <div className="rounded-lg shadow overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 md:p-8">
            <h3 className="text-xl font-bold text-stone-50 mb-6">Add New Practice</h3>
            <form onSubmit={handleAddPractice} className="space-y-5">
              <div>
                <label htmlFor="title" className={LABEL_DARK}>
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newPractice.title}
                  onChange={(e) => setNewPractice({ ...newPractice, title: e.target.value })}
                  className={INPUT_DARK}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className={LABEL_DARK}>
                  Description
                </label>
                <textarea
                  id="description"
                  value={newPractice.description}
                  onChange={(e) => setNewPractice({ ...newPractice, description: e.target.value })}
                  className={TEXTAREA_DARK}
                  required
                />
              </div>
              <div>
                <span className={LABEL_DARK}>Skill Levels</span>
                {renderSkillLevels(newPractice.skillLevels, handleSkillLevelToggle, 'dark')}
              </div>
              <div>
                <label htmlFor="customDirections" className={LABEL_DARK}>
                  Custom Directions
                </label>
                <textarea
                  id="customDirections"
                  value={newPractice.customDirections || ''}
                  onChange={(e) =>
                    setNewPractice({ ...newPractice, customDirections: e.target.value })
                  }
                  className={TEXTAREA_DARK}
                  placeholder="Shown in the amber directions block on the practice page"
                />
              </div>
              <div>
                <span className={LABEL_DARK}>Practice Tips</span>
                {renderTipsEditor(
                  newPractice.practiceTips,
                  newTip,
                  setNewTip,
                  handleAddTip,
                  handleRemoveTip,
                  'dark'
                )}
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className={BTN_PRIMARY} disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Practice'}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading && !isAddingPractice ? (
          <div className="text-center py-12 text-amber-900">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-900 mx-auto mb-4" />
            Loading practices...
          </div>
        ) : practices.length === 0 ? (
          <p className="text-center text-amber-900 py-12">No practices yet. Add your first one above.</p>
        ) : (
          <ul className="space-y-4">
            {practices.map((practice) => (
              <li
                key={practice.id}
                className="rounded-lg shadow overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800"
              >
                {editingPracticeId !== practice.id ? (
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-stone-50">{practice.title}</h3>
                      <p className="text-stone-400 text-sm mt-1 capitalize">
                        {practice.skillLevels.join(', ')}
                      </p>
                      {practice.id && (
                        <p className="text-stone-500 text-xs mt-2 font-mono">ID: {practice.id}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button type="button" className={BTN_GHOST_ON_DARK} onClick={() => handleEditPractice(practice)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className={BTN_DANGER}
                        onClick={() => practice.id && handleDeletePractice(practice.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 md:p-8 border-t border-stone-50/10">
                    <h4 className="text-lg font-bold text-stone-50 mb-6">Edit Practice</h4>
                    <form
                      onSubmit={(e) => {
                        if (practice.id) handleUpdatePractice(e, practice.id);
                      }}
                      className="space-y-5"
                    >
                      <div>
                        <label htmlFor={`title-${practice.id}`} className={LABEL_DARK}>
                          Title
                        </label>
                        <input
                          type="text"
                          id={`title-${practice.id}`}
                          value={editedPractice.title}
                          onChange={(e) =>
                            setEditedPractice({ ...editedPractice, title: e.target.value })
                          }
                          className={INPUT_DARK}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`description-${practice.id}`} className={LABEL_DARK}>
                          Description
                        </label>
                        <textarea
                          id={`description-${practice.id}`}
                          value={editedPractice.description}
                          onChange={(e) =>
                            setEditedPractice({ ...editedPractice, description: e.target.value })
                          }
                          className={TEXTAREA_DARK}
                          required
                        />
                      </div>
                      <div>
                        <span className={LABEL_DARK}>Skill Levels</span>
                        {renderSkillLevels(
                          editedPractice.skillLevels,
                          handleEditSkillLevelToggle,
                          'dark'
                        )}
                      </div>
                      <div>
                        <label htmlFor={`customDirections-${practice.id}`} className={LABEL_DARK}>
                          Custom Directions
                        </label>
                        <textarea
                          id={`customDirections-${practice.id}`}
                          value={editedPractice.customDirections || ''}
                          onChange={(e) =>
                            setEditedPractice({
                              ...editedPractice,
                              customDirections: e.target.value,
                            })
                          }
                          className={TEXTAREA_DARK}
                        />
                      </div>
                      <div>
                        <span className={LABEL_DARK}>Practice Tips</span>
                        {renderTipsEditor(
                          editedPractice.practiceTips,
                          editingTip,
                          setEditingTip,
                          handleAddEditTip,
                          handleRemoveEditTip,
                          'dark'
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end pt-2">
                        <button
                          type="button"
                          className={BTN_GHOST_ON_DARK}
                          onClick={() => setEditingPracticeId(null)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className={BTN_PRIMARY} disabled={isLoading}>
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default AdminPage;
