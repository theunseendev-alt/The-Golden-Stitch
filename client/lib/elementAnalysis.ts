/**
 * Enhanced element analysis utilities for context menus
 * Provides comprehensive element information for change notes
 */

export interface ElementAnalysis {
  tagName: string;
  id?: string;
  classes: string[];
  textContent: string;
  elementPath: string;
  location: string;
  type: string;
  attributes: Record<string, string>;
  currentState: {
    visible: boolean;
    disabled: boolean;
    readonly: boolean;
    value?: string;
  };
  suggestedChange: string;
}

/**
 * Get current user role for context
 */
export const getCurrentUserRole = (): string => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.role || "CUSTOMER";
  } catch {
    return "CUSTOMER";
  }
};

/**
 * Analyze element to get comprehensive information
 */
export const analyzeElement = (element: HTMLElement): ElementAnalysis => {
  const tagName = element.tagName.toLowerCase();
  const id = element.id || undefined;
  const classes = Array.from(element.classList);
  const textContent = element.textContent?.trim() || "";
  const attributes: Record<string, string> = {};

  // Extract relevant attributes
  Array.from(element.attributes).forEach((attr) => {
    attributes[attr.name] = attr.value;
  });

  // Get element path
  const elementPath = getElementPath(element);

  // Determine location/section
  const location = determineLocation(element);

  // Determine element type
  const type = determineElementType(element, attributes);

  // Get current state
  const currentState = {
    visible: element.offsetParent !== null,
    disabled:
      element.hasAttribute("disabled") ||
      element.getAttribute("aria-disabled") === "true",
    readonly:
      element.hasAttribute("readonly") ||
      element.getAttribute("aria-readonly") === "true",
    value: (element as any).value || element.getAttribute("value") || undefined,
  };

  // Generate suggested change based on element and role
  const suggestedChange = generateSuggestedChange(
    element,
    type,
    textContent,
    currentState,
  );

  return {
    tagName,
    id,
    classes,
    textContent,
    elementPath,
    location,
    type,
    attributes,
    currentState,
    suggestedChange,
  };
};

/**
 * Get CSS path of element
 */
const getElementPath = (element: HTMLElement): string => {
  const path: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      selector += `#${current.id}`;
      path.unshift(selector);
      break;
    } else {
      const siblings = Array.from(current.parentNode?.children || []).filter(
        (sibling: any) => sibling.tagName === current!.tagName,
      );

      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1;
        selector += `:nth-of-type(${index})`;
      }
      path.unshift(selector);
      current = current.parentElement;
    }
  }

  return path.join(" > ");
};

/**
 * Determine the logical location/section of an element
 */
const determineLocation = (element: HTMLElement): string => {
  const path = getElementPath(element).toLowerCase();

  if (
    path.includes("header") ||
    path.includes("nav") ||
    path.includes("navbar")
  ) {
    return "Header/Navigation";
  }
  if (path.includes("sidebar") || path.includes("aside")) {
    return "Sidebar";
  }
  if (path.includes("footer")) {
    return "Footer";
  }
  if (path.includes("main") || path.includes("content")) {
    return "Main Content";
  }
  if (path.includes("modal") || path.includes("dialog")) {
    return "Modal/Popup";
  }
  if (path.includes("form")) {
    return "Form";
  }
  if (path.includes("card")) {
    return "Card Component";
  }
  if (path.includes("button")) {
    return "Button/Action";
  }
  if (
    path.includes("input") ||
    path.includes("textarea") ||
    path.includes("select")
  ) {
    return "Form Input";
  }

  return "Unknown Location";
};

/**
 * Determine the functional type of an element
 */
const determineElementType = (
  element: HTMLElement,
  attributes: Record<string, string>,
): string => {
  const tagName = element.tagName.toLowerCase();

  switch (tagName) {
    case "button":
      return attributes.type === "submit"
        ? "Submit Button"
        : attributes.type === "reset"
          ? "Reset Button"
          : "Button";
    case "input":
      switch (attributes.type) {
        case "text":
          return "Text Input";
        case "email":
          return "Email Input";
        case "password":
          return "Password Input";
        case "checkbox":
          return "Checkbox";
        case "radio":
          return "Radio Button";
        case "file":
          return "File Upload";
        case "submit":
          return "Submit Input";
        default:
          return "Input Field";
      }
    case "textarea":
      return "Text Area";
    case "select":
      return "Dropdown/Select";
    case "img":
      return "Image";
    case "a":
      return "Link";
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return `${tagName.toUpperCase()} Heading`;
    case "p":
      return "Paragraph";
    case "div":
      return attributes.class?.includes("card") ? "Card" : "Container";
    case "span":
      return "Text Span";
    default:
      return tagName.charAt(0).toUpperCase() + tagName.slice(1);
  }
};

/**
 * Generate suggested change based on element, type, and user role
 */
const generateSuggestedChange = (
  element: HTMLElement,
  type: string,
  text: string,
  state: any,
): string => {
  const role = getCurrentUserRole();
  const hasText = text.length > 0;

  // Role-specific suggestions
  if (role === "ADMIN") {
    if (type.includes("Button")) {
      return `Change button text from "${text}" to "[Admin Action Text]"`;
    }
    if (type.includes("Input")) {
      return `Modify input field "${text || "Unnamed Field"}" - update validation or placeholder`;
    }
    if (type.includes("Heading")) {
      return `Update heading text from "${text}" to "[Administrative Heading]"`;
    }
  } else if (role === "DESIGNER") {
    if (type.includes("Button")) {
      return `Update button design/styling for "${text || "Unnamed Button"}" - adjust colors, fonts, or layout`;
    }
    if (type.includes("Image")) {
      return `Replace or optimize image "${text || "Unnamed Image"}" - update alt text or dimensions`;
    }
    if (type.includes("Heading")) {
      return `Adjust typography for heading "${text}" - change font size, weight, or color`;
    }
  } else if (role === "SEAMSTRESS") {
    if (type.includes("Button")) {
      return `Update button "${text || "Unnamed Button"}" - ensure it's accessible for order processing`;
    }
    if (type.includes("Input")) {
      return `Modify input "${text || "Unnamed Field"}" - ensure it captures necessary order details`;
    }
  } else if (role === "CUSTOMER") {
    if (type.includes("Button")) {
      return `Request changes to button "${text || "Unnamed Button"}" - make it clearer or more prominent`;
    }
    if (type.includes("Input")) {
      return `Suggest improvements to input "${text || "Unnamed Field"}" - make it more user-friendly`;
    }
  }

  // Generic suggestions based on element type
  if (type.includes("Button")) {
    return `Change button text from "${text}" to "[New Button Text]"`;
  }
  if (type.includes("Heading")) {
    return `Update heading from "${text}" to "[New Heading]"`;
  }
  if (type.includes("Input")) {
    return `Modify input "${text || "Unnamed Field"}" - update placeholder, validation, or label`;
  }
  if (type.includes("Link")) {
    return `Update link text from "${text}" to "[New Link Text]"`;
  }
  if (type.includes("Paragraph")) {
    return `Edit paragraph text: "${text.slice(0, 50)}${text.length > 50 ? "..." : ""}"`;
  }
  if (type.includes("Image")) {
    return `Replace image "${text || "Unnamed Image"}" or update its properties`;
  }

  return `Modify element "${type}" - specify desired changes`;
};

/**
 * Generate comprehensive change note with role context
 */
export const generateChangeNote = (element: HTMLElement): string => {
  const analysis = analyzeElement(element);
  const role = getCurrentUserRole();

  const note = [
    `[USER: ${role}]`,
    `[ELEMENT: <${analysis.tagName}${analysis.id ? `#${analysis.id}` : ""}${analysis.classes.length > 0 ? `.${analysis.classes.slice(0, 2).join(".")}` : ""}>]`,
    `[LOCATION: ${analysis.location}]`,
    `[ACTION NEEDED: ${analysis.suggestedChange}]`,
    `Current: "${analysis.textContent || "[Empty]"}" → Desired: "[Specify changes]"`,
    `Element path: ${analysis.elementPath}`,
    analysis.currentState.disabled ? "[DISABLED STATE]" : "",
    analysis.currentState.readonly ? "[READONLY STATE]" : "",
  ]
    .filter(Boolean)
    .join("\n");

  return note;
};

/**
 * Get element display name for context menu
 */
export const getElementDisplayName = (element: HTMLElement): string => {
  const text = element.textContent?.trim();
  const tagName = element.tagName.toLowerCase();
  const id = element.id;
  const firstClass = element.classList[0];

  if (text && text.length > 0 && text.length < 50) {
    return `${tagName}: "${text}"`;
  }
  if (id) {
    return `${tagName}#${id}`;
  }
  if (firstClass) {
    return `${tagName}.${firstClass}`;
  }
  return tagName;
};
