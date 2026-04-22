import { useState, useCallback, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { InvoiceProvider, useInvoices } from './context/InvoiceContext';
import Sidebar from './components/Sidebar/Sidebar';
import InvoiceList from './components/InvoiceList/InvoiceList';
import InvoiceDetail from './components/InvoiceDetail/InvoiceDetail';
import InvoiceForm from './components/InvoiceForm/InvoiceForm';
import DeleteModal from './components/Modal/DeleteModal';

function AppContent() {
  const { deleteInvoice } = useInvoices();

  const [currentView, setCurrentView] = useState('list');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editInvoiceId, setEditInvoiceId] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedInvoiceId]);

  const handleViewInvoice = useCallback((id) => {
    setSelectedInvoiceId(id);
    setCurrentView('detail');
  }, []);

  const handleGoBack = useCallback(() => {
    setCurrentView('list');
    setSelectedInvoiceId(null);
  }, []);

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

  const handleDeleteRequest = useCallback((id) => {
    setDeleteTargetId(id);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTargetId) {
      deleteInvoice(deleteTargetId);
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
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

      {formOpen && (
        <InvoiceForm
          mode={formMode}
          invoiceId={editInvoiceId}
          onClose={handleCloseForm}
        />
      )}

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

export default function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <AppContent />
      </InvoiceProvider>
    </ThemeProvider>
  );
}
