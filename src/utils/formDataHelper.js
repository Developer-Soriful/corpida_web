export const objectToFormData = (obj, form = null, namespace = '') => {
  const fd = form || new FormData();
  let formKey;

  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }

      const value = obj[property];

      // if the property is an object, but not a File, use recursivity.
      if (typeof value === 'object' && !(value instanceof File) && value !== null) {
        if (value instanceof Date) {
             fd.append(formKey, value.toISOString());
        } else {
             objectToFormData(value, fd, formKey);
        }
      } else {
        // if it's a string, number, or boolean (not an object) or a File
        // Handle null/undefined by not appending or appending empty string based on requirement
        // Here we'll append empty string for null to be safe, or just skip if undefined
        if (value !== undefined && value !== null) {
            fd.append(formKey, value);
        }
      }
    }
  }

  return fd;
};

export const createProfileFormData = (data) => {
    const formData = new FormData();
    
    // Helper to append field if it exists
    const appendIfPresent = (key, value) => {
        if (value !== undefined && value !== null && value !== '') {
            formData.append(key, value);
        }
    };

    // Basic Fields
    appendIfPresent('name', data.name);
    appendIfPresent('bio', data.bio);
    appendIfPresent('dateOfBirth', data.dateOfBirth);
    appendIfPresent('phoneNumber', data.phoneNumber);
    appendIfPresent('countryCode', data.countryCode);

    // File: Avatar
    if (data.avatar instanceof File) {
        formData.append('avatar', data.avatar);
    }

    // Teacher Fields (Complex Nested)
    // Based on Postman provided by user, "teacher" is a nested object in JSON.
    // However, for FormData, we usually flatten it or stringify it if backend expects a JSON string.
    // If Backend supports 'teacher[hourlyRate]', `objectToFormData` would handle it.
    // BUT many node backends with multer might expect JSON string for complex fields if not using a specific parser.
    // Let's assume standard array/bracket notation is supported (e.g. standard body-parser + multer).
    
    if ( data.teacher ) {
        // Manually handling specific teacher fields to ensure types are correct before appending
        // or just use the generic helper for the teacher object? 
        // Let's use generic helper for the teacher object section.
        objectToFormData(data.teacher, formData, 'teacher');
    }

    return formData;
};
