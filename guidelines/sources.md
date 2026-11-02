# Sources

The rules in these guidelines rest on the sources below. Rule IDs list the main source for each
area.

## Standards

- **WCAG 2.2** (W3C Recommendation): https://www.w3.org/TR/WCAG22/
  - What's new in 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
  - 1.4.3 Contrast (Minimum), 1.4.11 Non-text Contrast, 1.4.1 Use of Color → COLOR-1, COLOR-5, COLOR-6
  - 2.4.7 Focus Visible, 2.4.11 Focus Not Obscured (Minimum, AA), 2.4.13 Focus Appearance (AAA):
    https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html ·
    https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html → A11Y-3
  - Failure F78 (removing focus outlines): https://www.w3.org/WAI/WCAG22/Techniques/failures/F78.html
  - 2.5.8 Target Size (Minimum, 24px) and 2.5.5 Target Size (Enhanced, 44px) → LAYOUT-5, A11Y-4
  - 1.4.10 Reflow, 1.4.12 Text Spacing, 1.4.13 Content on Hover or Focus → LAYOUT-2, TYPE-3, CHOOSE-OVERLAY-1
  - 2.2.2 Pause, Stop, Hide; 2.3.1 Three Flashes; 2.3.3 Animation from Interactions → MOTION-3, MOTION-4
  - 3.3.1 Error Identification, 3.3.3 Error Suggestion, 3.3.7 Redundant Entry, 3.3.8 Accessible
    Authentication; 1.3.5 Identify Input Purpose → FORM-\*
  - 2.5.7 Dragging Movements → DATA-9
- **WAI-ARIA Authoring Practices Guide** (keyboard patterns): https://www.w3.org/WAI/ARIA/apg/ → A11Y-2
- **RFC 2119** (MUST/SHOULD vocabulary): https://www.rfc-editor.org/rfc/rfc2119

## UX research

- Nielsen Norman Group:
  - Checkboxes vs. Radio Buttons: https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/
  - Checkbox design guidelines: https://www.nngroup.com/articles/checkboxes-design-guidelines/
  - Toggle-Switch Guidelines: https://www.nngroup.com/articles/toggle-switch-guidelines/
  - Listboxes vs. Dropdown Lists: https://www.nngroup.com/articles/listbox-dropdown/
  - Does Your Form Really Need a Dropdown?: https://www.nngroup.com/articles/dropdown-list/
  - Radio Buttons: Always Select One?: https://www.nngroup.com/articles/radio-buttons-default-selection/
  - Reset and Cancel Buttons: https://www.nngroup.com/articles/reset-and-cancel-buttons/
  - State-Switch Controls: https://www.nngroup.com/articles/state-switch-buttons/
  - Placeholders in Form Fields Are Harmful: https://www.nngroup.com/articles/form-design-placeholders/
  - Response Times: The 3 Important Limits (0.1s / 1s / 10s): https://www.nngroup.com/articles/response-times-3-important-limits/
  - Skeleton Screens 101: https://www.nngroup.com/articles/skeleton-screens/
  - Designing Empty States in Complex Applications: https://www.nngroup.com/articles/empty-state-interface-design/
  - Infinite Scrolling Is Not for Every Website: https://www.nngroup.com/articles/infinite-scrolling/
  - F-Shaped Pattern of Reading: https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- Baymard Institute:
  - Mobile forms - avoid inline labels: https://baymard.com/blog/mobile-forms-avoid-inline-labels
  - Form field label placement: https://baymard.com/guidelines/685-placement-of-form-field-labels
  - Line length readability (50–75 characters): https://baymard.com/blog/line-length-readability
- Laws of UX (Fitts's, Hick's, Jakob's, Doherty threshold, proximity): https://lawsofux.com/
- Dyson (2004), _Visible Language_. Review of line-length studies (50–70 cpl optimal for
  comprehension), summarized at https://blogs.oregonstate.edu/calverta/line-width-in-digital-typography-for-accessibility-and-comprehension/

## Design systems

- Carbon (IBM):
  - Button (one primary per page): https://www.carbondesignsystem.com/components/button/usage/
  - Data table (alignment, density): https://carbondesignsystem.com/components/data-table/usage/
  - Pagination: https://carbondesignsystem.com/components/pagination/usage/
  - Empty states: https://carbondesignsystem.com/patterns/empty-states-pattern/
  - Loading: https://carbondesignsystem.com/patterns/loading-pattern/
  - Color: https://carbondesignsystem.com/elements/color/overview/
- Material Design 3:
  - Buttons (single prominent action): https://m3.material.io/components/all-buttons
  - Color roles: https://m3.material.io/styles/color/roles
  - Motion (easing and duration tokens): https://m3.material.io/styles/motion/easing-and-duration
  - Applying density (M2): https://m2.material.io/design/layout/applying-density.html
  - Data tables (M2): https://m2.material.io/components/data-tables
- Atlassian Design:
  - Color (neutral-first, accent and semantic roles): https://atlassian.design/foundations/color
  - Elevation (dark-mode surfaces get lighter): https://atlassian.design/foundations/elevation
- PatternFly alerts (modal vs inline vs toast): https://www.patternfly.org/components/alert/design-guidelines
- Apple Human Interface Guidelines (44pt targets): https://developer.apple.com/design/human-interface-guidelines/accessibility

## Color science

- OKLCH and perceptual uniformity: https://www.w3.org/TR/css-color-4/#ok-lab
- APCA (WCAG 3 draft contrast method): https://github.com/Myndex/apca-w3
