/**
 * =====================================================
 * UNIFIED MODAL SYSTEM - CLEANED VERSION
 * =====================================================
 * Estimate modal is supported via native Netlify submission
 * =====================================================
 */

const ModalSystem = {
  // Track all registered modals
  modals: {},
  activeModal: null,

  /**
   * =====================================================
   * INITIALIZATION
   * =====================================================
   */
  init: function () {
    console.log('Modal System: Initializing...');

    // Set up global event listeners
    this.setupGlobalListeners();

    // Auto-register modals found in DOM
    this.autoRegisterModals();

    // Initialize specific modal types if they exist
    this.initServiceModals();
    this.initFinancingModal();
    this.initEstimateModal();

    console.log('Modal System: Initialized successfully');
  },

  /**
   * =====================================================
   * MODAL REGISTRATION
   * =====================================================
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
   * =====================================================
   * AUTO-REGISTRATION
   * =====================================================
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
   * =====================================================
   * MODAL OPEN FUNCTIONALITY
   * =====================================================
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
   * =====================================================
   * MODAL CLOSE FUNCTIONALITY
   * =====================================================
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
   * =====================================================
   * CLOSE ALL MODALS
   * =====================================================
   */
  closeAll: function () {
    Object.keys(this.modals).forEach((modalId) => {
      this.close(modalId);
    });
  },

  /**
   * =====================================================
   * GLOBAL EVENT LISTENERS
   * =====================================================
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
   * =====================================================
   * ESTIMATE MODAL INITIALIZATION
   * =====================================================
   */
  initEstimateModal: function () {
    const modalSystem = this;

    console.log('Initializing estimate modal...');

    // Register the estimate modal if it exists
    if (document.getElementById('estimate-modal')) {
      this.register('estimate-modal', {
        onOpen: function (modal) {
          // Populate tracking fields when modal opens
          const form = document.getElementById('estimate-form');
          if (form) {
            const pageUrlField = form.querySelector('input[name="page_url"]');
            const pageTitleField = form.querySelector(
              'input[name="page_title"]'
            );
            const submittedFromField = form.querySelector(
              'input[name="submitted_from"]'
            );

            if (pageUrlField) pageUrlField.value = window.location.href;
            if (pageTitleField) pageTitleField.value = document.title;
            if (submittedFromField) {
              const path = window.location.pathname;
              const pageName =
                path === '/'
                  ? 'homepage'
                  : path.replace(/\//g, '').replace('.html', '');
              submittedFromField.value = pageName;
            }
          }

          // Focus on first input when opened
          const firstInput = modal.querySelector('input:not([type="hidden"])');
          if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
          }
        },
      });

      // Set up form handling
      this.setupEstimateForm();

      // Set up phone number formatting
      this.setupEstimatePhoneFormatting();
    }

    // Handle estimate trigger links
    document.addEventListener('click', (e) => {
      const estimateLink = e.target.closest(
        'a[href="#estimate"], a[href="/estimate"], .free-estimate-btn'
      );
      if (
        estimateLink ||
        (e.target.textContent && e.target.textContent.includes('Free Estimate'))
      ) {
        e.preventDefault();
        modalSystem.open('estimate-modal');
      }
    });

    // Make openEstimateModal available globally
    window.openEstimateModal = function () {
      modalSystem.open('estimate-modal');
    };
  },

  /**
   * Set up estimate form handling with Netlify submission
   */
  setupEstimateForm: function () {
    const form = document.getElementById('estimate-form');
    if (!form) return;

    // DO NOT prevent default submission - Netlify needs the native form submission
    form.addEventListener('submit', function (e) {
      // Don't prevent default! Let Netlify handle the submission

      const submitButton = form.querySelector('.submit-button');
      const buttonText = submitButton.querySelector('.button-text');
      const buttonLoading = submitButton.querySelector('.button-loading');

      // Show loading state
      submitButton.disabled = true;
      buttonText.style.display = 'none';
      buttonLoading.style.display = 'inline-flex';

      // The form will submit naturally to Netlify
      // Netlify will redirect to /thank-you.html after successful submission
    });
  },

  /**
   * Set up phone number formatting for estimate form
   */
  setupEstimatePhoneFormatting: function () {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function (e) {
      // Remove all non-digits
      let value = e.target.value.replace(/\D/g, '');

      // Format the number
      if (value.length > 0) {
        if (value.length <= 3) {
          value = `(${value}`;
        } else if (value.length <= 6) {
          value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else if (value.length <= 10) {
          value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(
            6,
            10
          )}`;
        } else {
          // Don't allow more than 10 digits
          value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(
            6,
            10
          )}`;
        }
      }

      e.target.value = value;
    });

    // Handle paste events
    phoneInput.addEventListener('paste', function (e) {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData(
        'text'
      );
      const digits = pastedText.replace(/\D/g, '').slice(0, 10);

      if (digits.length > 0) {
        let formatted = '';
        if (digits.length <= 3) {
          formatted = `(${digits}`;
        } else if (digits.length <= 6) {
          formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else {
          formatted = `(${digits.slice(0, 3)}) ${digits.slice(
            3,
            6
          )}-${digits.slice(6, 10)}`;
        }
        e.target.value = formatted;
      }
    });
  },

  /**
   * =====================================================
   * SERVICE MODALS INITIALIZATION
   * =====================================================
   */
  initServiceModals: function () {
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
   * =====================================================
   * FINANCING MODAL INITIALIZATION
   * =====================================================
   */
  initFinancingModal: function () {
    const financingModal = document.getElementById('financingApplicationModal');
    if (!financingModal) return;

    console.log('Initializing financing modal...');

    const modalSystem = this;

    this.register('financingApplicationModal', {
      onOpen: function (modal, data) {
        console.log('Opening financing modal with data:', data);

        // Update modal with plan data if provided
        if (data && data.planName) {
          const elements = {
            planName: modal.querySelector('#financingSelectedPlanName'),
            planCode: modal.querySelector('#financingSelectedPlanCode'),
            term: modal.querySelector('#financingSelectedTerm'),
            interest: modal.querySelector('#financingSelectedInterest'),
            planCodeInput: modal.querySelector('#financingPlanCode'),
            planNameInput: modal.querySelector('#financingPlanName'),
          };

          if (elements.planName)
            elements.planName.textContent = data.planName || 'N/A';
          if (elements.planCode)
            elements.planCode.textContent = data.planCode || 'N/A';
          if (elements.term) elements.term.textContent = data.term || 'N/A';
          if (elements.interest)
            elements.interest.textContent = data.interest || 'N/A';
          if (elements.planCodeInput)
            elements.planCodeInput.value = data.planCode || '';
          if (elements.planNameInput)
            elements.planNameInput.value = data.planName || '';
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

        // IMPORTANT: Add the financing-active class for CSS visibility
        modal.classList.add('financing-active');
        document.body.style.overflow = 'hidden';

        // Focus on first input
        const firstInput = modal.querySelector('#financingFirstName');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 100);
        }
      },
      onClose: function (modal) {
        console.log('Closing financing modal');

        // IMPORTANT: Remove the financing-active class
        modal.classList.remove('financing-active');
        document.body.style.overflow = '';

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

    /**
     * =====================================================
     * FINANCING BUTTON HANDLERS
     * =====================================================
     */
    const financingButtons = document.querySelectorAll(
      '.open-financing-application-modal'
    );
    console.log('Found ' + financingButtons.length + ' financing buttons');

    financingButtons.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('Financing button ' + (index + 1) + ' clicked');

        const data = {
          planName: button.getAttribute('data-financing-plan-name'),
          planCode: button.getAttribute('data-financing-plan-code'),
          interest: button.getAttribute('data-financing-interest'),
          term: button.getAttribute('data-financing-term'),
        };

        console.log('Button data:', data);

        modalSystem.open('financingApplicationModal', data);
      });
    });

    // Handle close button on the modal itself
    const closeBtn = financingModal.querySelector('.financing-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modalSystem.close('financingApplicationModal');
      });
    }

    // Handle cancel button in form
    const cancelBtn = financingModal.querySelector('.financing-modal-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modalSystem.close('financingApplicationModal');
      });
    }

    // Click outside modal to close
    financingModal.addEventListener('click', (e) => {
      if (e.target === financingModal) {
        modalSystem.close('financingApplicationModal');
      }
    });

    /**
     * =====================================================
     * FINANCING FORM SUBMISSION
     * =====================================================
     */
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
          modalSystem.close('financingApplicationModal');
        }, 3000);

        // Log form data (replace with actual submission)
        console.log(
          'Financing form submitted:',
          Object.fromEntries(new FormData(form))
        );
      });
    }

    /**
     * =====================================================
     * PHONE NUMBER FORMATTING
     * =====================================================
     */
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

    /**
     * =====================================================
     * CURRENCY FORMATTING
     * =====================================================
     */
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

    console.log('Financing modal initialization complete');
  },
};

/**
 * =====================================================
 * DOM READY INITIALIZATION
 * =====================================================
 */
document.addEventListener('DOMContentLoaded', function () {
  ModalSystem.init();
});

/**
 * =====================================================
 * GLOBAL EXPORT
 * =====================================================
 */
window.ModalSystem = ModalSystem;
