import { useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { InvoiceProvider, useInvoices } from './context/InvoiceContext';
import Sidebar from './components/Sidebar/Sidebar';
import InvoiceList from './components/InvoiceList/InvoiceList';
import InvoiceDetail from './components/InvoiceDetail/InvoiceDetail';
import InvoiceForm from './components/InvoiceForm/InvoiceForm';
import DeleteModal from './components/Modal/DeleteModal';

/**
 * Main app content with view routing.
 */
function AppContent() {
  const { deleteInvoice } = useInvoices();

  // View state: 'list' or 'detail'
  const [currentView, setCurrentView] = useState('list');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
  const [editInvoiceId, setEditInvoiceId] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // --- Navigation ---
  const handleViewInvoice = useCallback((id) => {
    setSelectedInvoiceId(id);
    setCurrentView('detail');
  }, []);

  const handleGoBack = useCallback(() => {
    setCurrentView('list');
    setSelectedInvoiceId(null);
  }, []);

  // --- Form ---
  const handleNewInvoice = useCallback(() => {
    setFormMode('create');
    setEditInvoiceId(null);
    setFormOpen(true);
  }, []);

  const handleEditInvoice = useCallback((id) => {
    setFormMode('edit');
    setEditInvoiceId(id);
    setFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setEditInvoiceId(null);
  }, []);

  // --- Delete ---
  const handleDeleteRequest = useCallback((id) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTargetId) {
      deleteInvoice(deleteTargetId);
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
      // Go back to list if we deleted the currently viewed invoice
      if (currentView === 'detail' && selectedInvoiceId === deleteTargetId) {
        setCurrentView('list');
        setSelectedInvoiceId(null);
      }
    }
  }, [deleteTargetId, deleteInvoice, currentView, selectedInvoiceId]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="app-main">
        <div className="app-content">
          {currentView === 'list' && (
            <InvoiceList
              onViewInvoice={handleViewInvoice}
              onNewInvoice={handleNewInvoice}
            />
          )}

          {currentView === 'detail' && selectedInvoiceId && (
            <InvoiceDetail
              invoiceId={selectedInvoiceId}
              onGoBack={handleGoBack}
              onEdit={handleEditInvoice}
              onDelete={handleDeleteRequest}
            />
          )}
        </div>
      </main>

      {/* Invoice Form Panel */}
      {formOpen && (
        <InvoiceForm
          mode={formMode}
          invoiceId={editInvoiceId}
          onClose={handleCloseForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && deleteTargetId && (
        <DeleteModal
          invoiceId={deleteTargetId}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}

/**
 * Root App component with providers.
 */
export default function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <AppContent />
      </InvoiceProvider>
    </ThemeProvider>
  );
}
