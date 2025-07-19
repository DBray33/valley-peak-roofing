/**
 * =====================================================
 * UNIFIED MODAL SYSTEM
 * =====================================================
 * A reusable modal system for all pages
 * Supports multiple modals with different styles
 * =====================================================
 */

const ModalSystem = {
  // Track all registered modals
  modals: {},
  activeModal: null,

  /**
   * Initialize the modal system
   */
  init: function () {
    console.log('Modal System: Initializing...');

    // Set up global event listeners
    this.setupGlobalListeners();

    // Auto-register modals found in DOM
    this.autoRegisterModals();

    // Initialize specific modal types if they exist
    this.initEstimateModal();
    this.initServiceModals();
    this.initFinancingModal();

    console.log('Modal System: Initialized successfully');
  },

  /**
   * Register a modal
   */
  register: function (modalId, options = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.warn(`Modal System: Modal with ID "${modalId}" not found`);
      return;
    }

    this.modals[modalId] = {
      element: modal,
      options: options,
      isOpen: false,
    };

    // Set up close button for this modal
    const closeButtons = modal.querySelectorAll(
      '[data-modal-close], .close-modal, .modal-close'
    );
    closeButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.close(modalId);
      });
    });

    console.log(`Modal System: Registered modal "${modalId}"`);
  },

  /**
   * Auto-register all modals found in DOM
   */
  autoRegisterModals: function () {
    const modals = document.querySelectorAll('.modal, [data-modal]');
    modals.forEach((modal) => {
      if (modal.id) {
        this.register(modal.id);
      }
    });
  },

  /**
   * Open a modal
   */
  open: function (modalId, data = {}) {
    const modalData = this.modals[modalId];
    if (!modalData) {
      // Try to register it first
      this.register(modalId);
      modalData = this.modals[modalId];

      if (!modalData) {
        console.error(`Modal System: Modal "${modalId}" not found`);
        return;
      }
    }

    // Close any currently open modal
    if (this.activeModal && this.activeModal !== modalId) {
      this.close(this.activeModal);
    }

    const modal = modalData.element;

    // Add active class
    modal.classList.add('active', 'modal-active');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    // Store as active modal
    this.activeModal = modalId;
    modalData.isOpen = true;

    // Call onOpen callback if provided
    if (modalData.options.onOpen) {
      modalData.options.onOpen(modal, data);
    }

    // Trigger custom event
    modal.dispatchEvent(new CustomEvent('modal:opened', { detail: data }));

    console.log(`Modal System: Opened modal "${modalId}"`);
  },

  /**
   * Close a modal
   */
  close: function (modalId) {
    const modalData = this.modals[modalId];
    if (!modalData || !modalData.isOpen) return;

    const modal = modalData.element;

    // Remove active class
    modal.classList.remove('active', 'modal-active');

    // Remove body classes if no other modals are open
    if (this.activeModal === modalId) {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      this.activeModal = null;
    }

    modalData.isOpen = false;

    // Call onClose callback if provided
    if (modalData.options.onClose) {
      modalData.options.onClose(modal);
    }

    // Trigger custom event
    modal.dispatchEvent(new CustomEvent('modal:closed'));

    console.log(`Modal System: Closed modal "${modalId}"`);
  },

  /**
   * Close all modals
   */
  closeAll: function () {
    Object.keys(this.modals).forEach((modalId) => {
      this.close(modalId);
    });
  },

  /**
   * Setup global event listeners
   */
  setupGlobalListeners: function () {
    // Click outside to close
    document.addEventListener('click', (e) => {
      if (this.activeModal) {
        const modal = this.modals[this.activeModal].element;
        if (e.target === modal) {
          this.close(this.activeModal);
        }
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close(this.activeModal);
      }
    });

    // Open modal triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-modal-trigger]');
      if (trigger) {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-trigger');
        this.open(modalId);
      }
    });
  },

  /**
   * Initialize Estimate Modal specific functionality
   */
  initEstimateModal: function () {
    // Handle estimate links
    document.addEventListener('click', (e) => {
      const estimateLink = e.target.closest('a[href="#estimate"]');
      if (estimateLink) {
        e.preventDefault();
        this.open('estimate-modal');
      }
    });

    // Register estimate modal if it exists
    if (document.getElementById('estimate-modal')) {
      this.register('estimate-modal', {
        onOpen: function (modal) {
          // Focus on first input when opened
          const firstInput = modal.querySelector('input:not([type="hidden"])');
          if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
          }
        },
      });

      // Handle Netlify form submission for estimate forms
      const estimateForm = document.querySelector(
        'form[name="estimate-popup-homepage"]'
      );
      if (estimateForm) {
        // Ensure form method is POST
        estimateForm.setAttribute('method', 'POST');
        estimateForm.setAttribute('action', '/');

        // Handle form submission
        estimateForm.addEventListener('submit', (e) => {
          e.preventDefault();

          // Create FormData and submit via fetch
          const formData = new FormData(estimateForm);

          fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString(),
          })
            .then((response) => {
              if (response.ok) {
                // Show success message
                const modalBody = estimateForm.closest('.modal-body');
                modalBody.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                  <i class="fas fa-check-circle" style="font-size: 48px; color: #28a745; margin-bottom: 20px;"></i>
                  <h3>Thank You!</h3>
                  <p>We'll contact you within 24 hours to schedule your free inspection.</p>
                </div>
              `;

                // Close modal after 3 seconds
                setTimeout(() => {
                  this.close('estimate-modal');
                  // Reload page to reset form
                  location.reload();
                }, 3000);
              } else {
                throw new Error('Form submission failed');
              }
            })
            .catch((error) => {
              console.error('Error:', error);
              alert(
                'There was an error submitting the form. Please try again.'
              );
            });
        });
      }
    }
  },

  /**
   * Initialize Service Modals (architectural shingles, metal roof, gutter guard)
   */
  initServiceModals: function () {
    // Store reference to ModalSystem for use in callbacks
    const modalSystem = this;

    // Service modal configurations
    const serviceModals = [
      {
        modalId: 'architectural-shingles-modal',
        triggerFunction: 'openArchitecturalShinglesModal',
        closeFunction: 'closeArchitecturalShinglesModal',
      },
      {
        modalId: 'metal-roof-modal',
        triggerFunction: 'openMetalRoofModal',
        closeFunction: 'closeMetalRoofModal',
      },
      {
        modalId: 'gutter-guard-modal',
        triggerFunction: 'openGutterGuardModal',
        closeFunction: 'closeGutterGuardModal',
      },
    ];

    // Register each service modal and create global functions
    serviceModals.forEach((config) => {
      if (document.getElementById(config.modalId)) {
        modalSystem.register(config.modalId);

        // Create global functions for backward compatibility
        window[config.triggerFunction] = function (event) {
          if (event) event.preventDefault();
          modalSystem.open(config.modalId);
        };

        window[config.closeFunction] = function () {
          modalSystem.close(config.modalId);
        };
      }
    });
  },

  /**
   * Initialize Financing Modal specific functionality
   */
  initFinancingModal: function () {
    const financingModal = document.getElementById('financingApplicationModal');
    if (!financingModal) return;

    // Register the modal
    this.register('financingApplicationModal', {
      onOpen: function (modal, data) {
        // Update modal with plan data if provided
        if (data.planName) {
          const elements = {
            planName: modal.querySelector('#financingSelectedPlanName'),
            planCode: modal.querySelector('#financingSelectedPlanCode'),
            term: modal.querySelector('#financingSelectedTerm'),
            interest: modal.querySelector('#financingSelectedInterest'),
            planCodeInput: modal.querySelector('#financingPlanCode'),
            planNameInput: modal.querySelector('#financingPlanName'),
          };

          if (elements.planName) elements.planName.textContent = data.planName;
          if (elements.planCode) elements.planCode.textContent = data.planCode;
          if (elements.term) elements.term.textContent = data.term;
          if (elements.interest) elements.interest.textContent = data.interest;
          if (elements.planCodeInput)
            elements.planCodeInput.value = data.planCode;
          if (elements.planNameInput)
            elements.planNameInput.value = data.planName;
        }

        // Set tracking data
        const form = modal.querySelector('#financingApplicationForm');
        if (form) {
          const timestamp = new Date().toISOString();
          const timestampInput = form.querySelector(
            '[name="financing_timestamp"]'
          );
          if (timestampInput) timestampInput.value = timestamp;

          const urlInput = form.querySelector('[name="financing_page_url"]');
          if (urlInput) urlInput.value = window.location.href;

          // Set UTM parameters
          const urlParams = new URLSearchParams(window.location.search);
          const utmFields = ['utm_source', 'utm_medium', 'utm_campaign'];
          utmFields.forEach((field) => {
            const input = form.querySelector(`[name="financing_${field}"]`);
            if (input) input.value = urlParams.get(field) || '';
          });
        }

        // Focus on first input
        const firstInput = modal.querySelector('#financingFirstName');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 100);
        }
      },
      onClose: function (modal) {
        // Reset form
        const form = modal.querySelector('#financingApplicationForm');
        if (form) {
          form.reset();
          form.style.display = '';

          // Remove success message if exists
          const successMessage = modal.querySelector(
            '.financing-success-wrapper'
          );
          if (successMessage) {
            successMessage.remove();
          }
        }
      },
    });

    // Handle financing buttons
    const financingButtons = document.querySelectorAll(
      '.open-financing-application-modal'
    );
    financingButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        const data = {
          planName: button.getAttribute('data-financing-plan-name'),
          planCode: button.getAttribute('data-financing-plan-code'),
          interest: button.getAttribute('data-financing-interest'),
          term: button.getAttribute('data-financing-term'),
        };

        this.open('financingApplicationModal', data);
      });
    });

    // Handle form submission
    const form = document.getElementById('financingApplicationForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show success message
        form.style.display = 'none';

        const successDiv = document.createElement('div');
        successDiv.className = 'financing-success-wrapper';
        successDiv.innerHTML = `
          <div class="financing-success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <p class="form-guarantee">
            <i class="fas fa-shield-alt"></i>
            Thank you! We'll contact you within 24 hours.
          </p>
        `;

        form.parentNode.appendChild(successDiv);

        // Close modal after delay
        setTimeout(() => {
          this.close('financingApplicationModal');
        }, 3000);

        // Log form data (replace with actual submission)
        console.log(
          'Financing form submitted:',
          Object.fromEntries(new FormData(form))
        );
      });
    }

    // Format phone number
    const phoneInput = document.getElementById('financingPhone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
          if (value.length <= 3) {
            value = value;
          } else if (value.length <= 6) {
            value = value.slice(0, 3) + '-' + value.slice(3);
          } else {
            value =
              value.slice(0, 3) +
              '-' +
              value.slice(3, 6) +
              '-' +
              value.slice(6, 10);
          }
        }
        e.target.value = value;
      });
    }

    // Format currency input
    const amountInput = document.getElementById('financingEstimatedAmount');
    if (amountInput) {
      amountInput.addEventListener('blur', function (e) {
        let value = e.target.value.replace(/[^\d.]/g, '');
        if (value) {
          value = parseFloat(value).toFixed(2);
          e.target.value = '$' + value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      });

      amountInput.addEventListener('focus', function (e) {
        e.target.value = e.target.value.replace(/[$,]/g, '');
      });
    }
  },
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  ModalSystem.init();
});

// Export for use in other scripts
window.ModalSystem = ModalSystem;
