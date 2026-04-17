import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  MessageCircle,
  ChevronDown,
  Send,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  Clock3,
} from 'lucide-react';
import styles from './Support.module.css';

// Mock data types
interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  date: string;
  description: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  sender: 'patient' | 'support';
  message: string;
  timestamp: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

// Mock ticket data
const mockTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    subject: 'Unable to reschedule appointment',
    category: 'Technical Issue',
    status: 'Open',
    priority: 'High',
    date: '2025-04-15',
    description:
      'I am unable to reschedule my appointment through the patient portal. The reschedule button appears to be non-functional.',
    messages: [
      {
        id: '1',
        sender: 'patient',
        message: 'I am unable to reschedule my appointment through the patient portal.',
        timestamp: '2025-04-15 10:30 AM',
      },
      {
        id: '2',
        sender: 'support',
        message:
          'Thank you for contacting us. We are looking into this issue. In the meantime, please try clearing your browser cache.',
        timestamp: '2025-04-15 2:45 PM',
      },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'Billing question regarding recent visit',
    category: 'Billing Question',
    status: 'In Progress',
    priority: 'Medium',
    date: '2025-04-10',
    description: 'I have questions about the charges from my recent visit on April 8th.',
    messages: [
      {
        id: '1',
        sender: 'patient',
        message: 'I received an invoice for my recent visit. Can you explain the charges?',
        timestamp: '2025-04-10 9:00 AM',
      },
      {
        id: '2',
        sender: 'support',
        message:
          'We are reviewing your invoice. Our billing specialist will contact you within 24 hours.',
        timestamp: '2025-04-10 11:30 AM',
      },
    ],
  },
  {
    id: 'TKT-003',
    subject: 'Lab results interpretation',
    category: 'Other',
    status: 'Resolved',
    priority: 'Low',
    date: '2025-04-05',
    description: 'Questions about the results from recent blood work.',
    messages: [
      {
        id: '1',
        sender: 'patient',
        message: 'Can my provider explain what these lab results mean?',
        timestamp: '2025-04-05 3:15 PM',
      },
      {
        id: '2',
        sender: 'support',
        message: 'Your provider will review these during your next appointment.',
        timestamp: '2025-04-05 5:00 PM',
      },
    ],
  },
];

// Mock FAQs
const faqs = [
  {
    id: '1',
    question: 'How do I reschedule an appointment?',
    answer:
      'You can reschedule your appointment by going to the Appointments section, selecting the appointment you wish to reschedule, and clicking "Reschedule". You will see available time slots for your provider. If you encounter any issues, please contact our support team.',
  },
  {
    id: '2',
    question: 'How do I download lab results?',
    answer:
      'Lab results are available in the "Lab Orders" section of your patient portal once your provider has reviewed and released them. Click on any result to view the details, and use the "Download" button to save a PDF copy to your device.',
  },
  {
    id: '3',
    question: 'How do I update my insurance information?',
    answer:
      'You can update your insurance information by going to Settings > Insurance Settings. Click "Edit" to modify your insurance provider, policy number, or group number. Be sure to save your changes.',
  },
  {
    id: '4',
    question: 'How do I contact my provider?',
    answer:
      'You can send messages to your provider through the "Messages" section of your portal. For urgent matters, please call our office directly. Emergency concerns should be directed to emergency services.',
  },
  {
    id: '5',
    question: 'How do I reset my password?',
    answer:
      'Click "Forgot Password" on the login page and enter your email address. You will receive an email with instructions to reset your password. Follow the link and create a new password. If you do not receive the email, check your spam folder.',
  },
];

const Support: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq' | 'contact'>('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Form states
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'Technical Issue',
    priority: 'Medium',
    description: '',
    attachment: null as File | null,
  });

  // Modal states
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Helper functions
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Ticket handlers
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      addToast('error', 'Please fill in all required fields');
      return;
    }

    const ticketId = `TKT-${String(tickets.length + 1).padStart(3, '0')}`;
    const ticket: SupportTicket = {
      id: ticketId,
      subject: newTicket.subject,
      category: newTicket.category,
      status: 'Open',
      priority: newTicket.priority as 'Low' | 'Medium' | 'High' | 'Urgent',
      date: new Date().toISOString().split('T')[0],
      description: newTicket.description,
      messages: [
        {
          id: '1',
          sender: 'patient',
          message: newTicket.description,
          timestamp: new Date().toLocaleString(),
        },
      ],
    };

    setTickets((prev) => [ticket, ...prev]);
    setNewTicket({
      subject: '',
      category: 'Technical Issue',
      priority: 'Medium',
      description: '',
      attachment: null,
    });
    addToast('success', 'Support ticket created successfully');
  };

  const handleOpenTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      messages: [
        ...selectedTicket.messages,
        {
          id: String(selectedTicket.messages.length + 1),
          sender: 'patient' as const,
          message: newMessage,
          timestamp: new Date().toLocaleString(),
        },
      ],
    };

    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicket.id ? updatedTicket : t))
    );
    setSelectedTicket(updatedTicket);
    setNewMessage('');
    addToast('success', 'Message sent');
  };

  // Filter and search tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' || ticket.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Utility functions
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return styles.badgeUrgent;
      case 'High':
        return styles.badgeHigh;
      case 'Medium':
        return styles.badgeMedium;
      case 'Low':
        return styles.badgeLow;
      default:
        return '';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Open':
        return styles.statusOpen;
      case 'In Progress':
        return styles.statusInProgress;
      case 'Resolved':
        return styles.statusResolved;
      case 'Closed':
        return styles.statusClosed;
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle size={16} />;
      case 'In Progress':
        return <Clock size={16} />;
      case 'Resolved':
        return <CheckCircle size={16} />;
      case 'Closed':
        return <CheckCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Support Center</h1>
        <p className={styles.subtitle}>
          We're here to help you with your healthcare needs
        </p>
      </div>

      {/* Toast notifications */}
      <div className={styles.toastContainer} role="region" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
            <div className={styles.toastContent}>
              {toast.type === 'success' && (
                <CheckCircle size={20} className={styles.toastIcon} />
              )}
              {toast.type === 'error' && (
                <AlertCircle size={20} className={styles.toastIcon} />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              className={styles.toastClose}
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === 'tickets' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          <MessageCircle size={18} />
          Support Tickets
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'faq' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          <FileText size={18} />
          FAQ
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'contact' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <Phone size={18} />
          Contact Support
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* TICKETS TAB */}
        {activeTab === 'tickets' && (
          <>
            {/* Create Ticket Section */}
            <div className={styles.card}>
              <h2 className={styles.sectionTitle}>Create Support Ticket</h2>

              <form className={styles.form} onSubmit={handleCreateTicket}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="subject" className={styles.label}>
                      Subject *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      className={styles.input}
                      placeholder="Brief description of your issue"
                      value={newTicket.subject}
                      onChange={(e) =>
                        setNewTicket((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="category" className={styles.label}>
                      Category
                    </label>
                    <select
                      id="category"
                      className={styles.input}
                      value={newTicket.category}
                      onChange={(e) =>
                        setNewTicket((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                    >
                      <option>Technical Issue</option>
                      <option>Billing Question</option>
                      <option>Appointment Issue</option>
                      <option>Prescription Issue</option>
                      <option>Insurance Issue</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="priority" className={styles.label}>
                      Priority
                    </label>
                    <select
                      id="priority"
                      className={styles.input}
                      value={newTicket.priority}
                      onChange={(e) =>
                        setNewTicket((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description" className={styles.label}>
                    Description *
                  </label>
                  <textarea
                    id="description"
                    className={styles.textarea}
                    placeholder="Please provide details about your issue"
                    rows={5}
                    value={newTicket.description}
                    onChange={(e) =>
                      setNewTicket((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    id="attachment"
                    className={styles.fileInput}
                    onChange={(e) =>
                      setNewTicket((prev) => ({
                        ...prev,
                        attachment: e.target.files?.[0] || null,
                      }))
                    }
                    aria-label="Upload attachment"
                  />
                  <label htmlFor="attachment" className={styles.uploadLabel}>
                    <FileText size={24} />
                    <span>
                      {newTicket.attachment
                        ? newTicket.attachment.name
                        : 'Click to upload or drag and drop'}
                    </span>
                    <span className={styles.uploadHint}>PDF, images up to 10MB</span>
                  </label>
                </div>

                <button type="submit" className={styles.buttonPrimary}>
                  <Plus size={18} />
                  Submit Ticket
                </button>
              </form>
            </div>

            {/* Tickets List Section */}
            <div className={styles.card}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Your Tickets</h2>
              </div>

              {/* Search and Filter */}
              <div className={styles.searchFilter}>
                <div className={styles.searchBox}>
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search by subject or ticket ID..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className={styles.filterBox}>
                  <Filter size={20} />
                  <select
                    className={styles.filterSelect}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option>All</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>

              {/* Tickets Table */}
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Subject</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className={styles.tdId}>{ticket.id}</td>
                          <td className={styles.tdSubject}>{ticket.subject}</td>
                          <td className={styles.tdCategory}>{ticket.category}</td>
                          <td>
                            <span
                              className={`${styles.badge} ${getStatusBadgeColor(
                                ticket.status
                              )}`}
                            >
                              {getStatusIcon(ticket.status)}
                              {ticket.status}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`${styles.badge} ${getPriorityBadgeColor(
                                ticket.priority
                              )}`}
                            >
                              {ticket.priority}
                            </span>
                          </td>
                          <td className={styles.tdDate}>{ticket.date}</td>
                          <td className={styles.tdActions}>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleOpenTicket(ticket)}
                              title="View ticket"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              className={styles.actionButton}
                              onClick={() =>
                                addToast('success', 'Ticket downloaded')
                              }
                              title="Download ticket"
                            >
                              <Download size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className={styles.emptyState}>
                          <FileText size={32} />
                          <p>No tickets found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* FAQ TAB */}
        {activeTab === 'faq' && (
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>

            <div className={styles.accordion}>
              {faqs.map((faq) => (
                <div key={faq.id} className={styles.accordionItem}>
                  <button
                    className={styles.accordionHeader}
                    onClick={() =>
                      setExpandedFaqId(
                        expandedFaqId === faq.id ? null : faq.id
                      )
                    }
                    aria-expanded={expandedFaqId === faq.id}
                  >
                    <span className={styles.accordionTitle}>{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={
                        expandedFaqId === faq.id ? styles.chevronOpen : ''
                      }
                    />
                  </button>

                  {expandedFaqId === faq.id && (
                    <div className={styles.accordionContent}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT SUPPORT TAB */}
        {activeTab === 'contact' && (
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Contact Support</h2>

            <div className={styles.contactGrid}>
              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <Mail size={32} />
                </div>
                <h3>Email Support</h3>
                <p className={styles.contactInfo}>support@telemed.com</p>
                <p className={styles.contactDescription}>
                  Send us an email and we'll respond within 24 hours
                </p>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <Phone size={32} />
                </div>
                <h3>Phone Support</h3>
                <p className={styles.contactInfo}>1-800-TELEMED</p>
                <p className={styles.contactDescription}>
                  Call us for urgent issues during business hours
                </p>
              </div>

              <div className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <Clock3 size={32} />
                </div>
                <h3>Support Hours</h3>
                <p className={styles.contactInfo}>Monday – Friday</p>
                <p className={styles.contactInfo}>8:00 AM – 6:00 PM EST</p>
                <p className={styles.contactDescription}>
                  Available during business hours for all inquiries
                </p>
              </div>
            </div>

            <div className={styles.contactNote}>
              <AlertTriangle size={20} />
              <div>
                <p className={styles.contactNoteTitle}>Emergency Support</p>
                <p className={styles.contactNoteText}>
                  For medical emergencies, please call 911 or visit your nearest
                  emergency room. Do not contact support for emergency situations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {modalOpen && selectedTicket && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalOpen(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleContainer}>
                <h3 id="modal-title" className={styles.modalTitle}>
                  {selectedTicket.subject}
                </h3>
                <span className={styles.ticketId}>{selectedTicket.id}</span>
              </div>
              <button
                className={styles.modalClose}
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalContent}>
              {/* Ticket Info */}
              <div className={styles.ticketInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Status</span>
                  <span
                    className={`${styles.badge} ${getStatusBadgeColor(
                      selectedTicket.status
                    )}`}
                  >
                    {getStatusIcon(selectedTicket.status)}
                    {selectedTicket.status}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Priority</span>
                  <span
                    className={`${styles.badge} ${getPriorityBadgeColor(
                      selectedTicket.priority
                    )}`}
                  >
                    {selectedTicket.priority}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Category</span>
                  <span>{selectedTicket.category}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Date</span>
                  <span>{selectedTicket.date}</span>
                </div>
              </div>

              <div className={styles.description}>
                <h4>Description</h4>
                <p>{selectedTicket.description}</p>
              </div>

              {/* Messages */}
              <div className={styles.messages}>
                <h4>Conversation</h4>
                <div className={styles.messageList}>
                  {selectedTicket.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`${styles.message} ${styles[msg.sender]}`}
                    >
                      <div className={styles.messageSender}>
                        {msg.sender === 'patient' ? 'You' : 'Support Team'}
                      </div>
                      <div className={styles.messageContent}>{msg.message}</div>
                      <div className={styles.messageTime}>{msg.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Input */}
              {selectedTicket.status !== 'Closed' && (
                <div className={styles.replyBox}>
                  <textarea
                    className={styles.textarea}
                    placeholder="Type your message..."
                    rows={4}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    className={styles.buttonPrimary}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send size={18} />
                    Send Message
                  </button>
                </div>
              )}

              {selectedTicket.status === 'Closed' && (
                <div className={styles.closedMessage}>
                  <CheckCircle size={20} />
                  <p>This ticket is closed and cannot be replied to.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;