export function validateInvoice(formData, isDraft = false) {
  const errors = {};

  if (isDraft) {
    return { isValid: true, errors: {} };
  }

  if (!formData.senderAddress?.street?.trim()) {
    errors.senderStreet = "can't be empty";
  }
  if (!formData.senderAddress?.city?.trim()) {
    errors.senderCity = "can't be empty";
  }
  if (!formData.senderAddress?.postCode?.trim()) {
    errors.senderPostCode = "can't be empty";
  }
  if (!formData.senderAddress?.country?.trim()) {
    errors.senderCountry = "can't be empty";
  }

  if (!formData.clientName?.trim()) {
    errors.clientName = "can't be empty";
  }
  if (!formData.clientEmail?.trim()) {
    errors.clientEmail = "can't be empty";
  } else if (!isValidEmail(formData.clientEmail)) {
    errors.clientEmail = 'invalid email';
  }
  if (!formData.clientAddress?.street?.trim()) {
    errors.clientStreet = "can't be empty";
  }
  if (!formData.clientAddress?.city?.trim()) {
    errors.clientCity = "can't be empty";
  }
  if (!formData.clientAddress?.postCode?.trim()) {
    errors.clientPostCode = "can't be empty";
  }
  if (!formData.clientAddress?.country?.trim()) {
    errors.clientCountry = "can't be empty";
  }

  if (!formData.createdAt) {
    errors.createdAt = "can't be empty";
  }
  if (!formData.description?.trim()) {
    errors.description = "can't be empty";
  }

  if (!formData.items || formData.items.length === 0) {
    errors.items = 'An item must be added';
  } else {
    const itemErrors = formData.items.map((item) => {
      const err = {};
      if (!item.name?.trim()) err.name = "can't be empty";
      if (!item.quantity || Number(item.quantity) <= 0) err.quantity = 'must be > 0';
      if (!item.price || Number(item.price) <= 0) err.price = 'must be > 0';
      return err;
    });
    
    const hasItemErrors = itemErrors.some(
      (err) => Object.keys(err).length > 0
    );
    if (hasItemErrors) {
      errors.itemErrors = itemErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
