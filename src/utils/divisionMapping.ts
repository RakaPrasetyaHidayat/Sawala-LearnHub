/**
 * Division mapping utility untuk mengkonversi UUID/kode division menjadi nama yang user-friendly
 */

export const DIVISION_MAPPING: Record<string, string> = {
  // UI/UX variations
  "uiux": "UI/UX Designer",
  "ui-ux": "UI/UX Designer", 
  "ui/ux": "UI/UX Designer",
  "uiux-designer": "UI/UX Designer",
  "UI/UX": "UI/UX Designer",
  "UI/UX Designer": "UI/UX Designer",
  
  // Frontend variations
  "frontend": "Frontend Dev",
  "FE": "Frontend Dev",
  "frontend-dev": "Frontend Dev",
  "Frontend": "Frontend Dev",
  "Frontend Dev": "Frontend Dev",
  "Frontend Developer": "Frontend Dev",
  
  // Backend variations
  "backend": "Backend Developer",
  "backend-dev": "Backend Developer",
  "Backend": "Backend Developer",
  "Backend Dev": "Backend Developer",
  "Backend Developer": "Backend Developer",
  
  // DevOps variations
  "devops": "DevOps",
  "DevOps": "DevOps",
  "0e5c4601-d68a-45d0-961f-b11e0472a71b": "DevOps", // Hardcoded UUID for DevOps
};

/**
 * Helper function to get user-friendly division name from user object
 * @param user - User object that may contain division information
 * @returns User-friendly division name
 */
export function getDivisionDisplayName(user: any): string {
  if (!user) return "Unknown Division";

  // Check for division_name first (most reliable)
  if (user?.division_name && String(user.division_name).trim()) {
    return String(user.division_name).trim();
  }

  // Check if division is an object with name property
  if (user?.division && typeof user.division === "object" && user.division.name) {
    return String(user.division.name).trim();
  }

  // Check division field (string)
  if (user?.division && typeof user.division === "string") {
    const div = String(user.division).trim();
    // If it's a UUID, try to map it
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRe.test(div)) {
      return DIVISION_MAPPING[div.toLowerCase()] || "Unknown Division";
    }
    // If it's not a UUID, try to map it directly
    return DIVISION_MAPPING[div.toLowerCase()] || div;
  }

  // Check division_id field
  if (user?.division_id && typeof user.division_id === "string") {
    const divId = String(user.division_id).trim();
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRe.test(divId)) {
      return DIVISION_MAPPING[divId.toLowerCase()] || "Unknown Division";
    }
    return DIVISION_MAPPING[divId.toLowerCase()] || divId;
  }

  // Check role field as fallback
  if (user?.role && typeof user.role === "string") {
    const role = String(user.role).trim();
    return DIVISION_MAPPING[role.toLowerCase()] || role;
  }

  return "Unknown Division";
}

/**
 * Check if a string is a UUID
 * @param str - String to check
 * @returns True if string is a UUID
 */
export function isUUID(str: string): boolean {
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRe.test(str);
}

/**
 * Get division name from UUID or string
 * @param divisionId - Division ID (UUID or string)
 * @returns User-friendly division name
 */
export function mapDivisionId(divisionId: string): string {
  if (!divisionId) return "Unknown Division";
  
  const normalizedId = String(divisionId).trim().toLowerCase();
  return DIVISION_MAPPING[normalizedId] || divisionId;
}
