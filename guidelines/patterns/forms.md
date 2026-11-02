# Forms

Forms are where users do the work that matters to the business, and where most UX friction
occurs. These rules come mainly from Baymard Institute's form-usability research, NN/g and WCAG 3.3.

## FORM-1 - Layout

- **Single column** (MUST for multi-field forms). Multi-column forms cause users to skip fields and
  misread the order (Baymard, CXL eye-tracking). Exception: short, tightly related pairs on one row
  (City | State | ZIP, First | Last name) on desktop only.
- Max width `var(--content-width-form)` (640px). Size each field to its expected content length.
- Order fields logically (the user's mental order), and group related fields under a heading with
  `--spacing-xl` between groups (SPACE-3).
- Use `FormBuilder layout="vertical"` by default. `horizontal` (label beside field) only for dense
  settings pages that users revisit often. `grid` only for short, related pairs, as above.

## FORM-2 - Labels (MUST)

- Visible label **above** the field (fastest completion, works on mobile, survives zoom and long
  translations).
- Never use placeholder-only labels or floating labels for important fields (Baymard: users lose
  context and delete input to see the label).
- Label text: a short noun phrase in sentence case, no trailing colon.
- Mark the **minority** case: if most fields are required, mark the optional ones "(optional)". If
  most are optional, mark required ones with an asterisk plus a legend. Always set `required` on the
  input itself.

## FORM-3 - Help text

- Put format requirements **before** the user types: `helperText` below the label or field ("At
  least 12 characters"). Don't reveal rules only in the error.
- A placeholder MAY show an example ("e.g. jane@company.com") alongside the label, never instead
  of it.
- Use `Tooltip` "ⓘ" help sparingly. Anything needed to complete the field belongs in visible helper
  text.

## FORM-4 - Validation timing

- Validate a field on **blur** (`validateOn="blur"`), not on every keystroke. Premature errors
  ("invalid email" after one character) are hostile (Baymard, NN/g).
- After a field has shown an error, re-validate on **change** so the error clears as soon as it is
  fixed.
- Validate everything again on submit. Server errors map back onto their fields.
- Positive validation (a green check) is useful only for fields where success isn't obvious
  (username availability, password strength).

## FORM-5 - Error messages (MUST)

- Show them inline, directly below the field (`error` + `errorMessage`), in `--theme-error` with an
  error icon. Not color alone.
- Say what went wrong **and** how to fix it: "Enter a date in the future", not "Invalid date"
  (WCAG 3.3.3).
- On submit with errors: show a summary at the top listing each error as a link to its field, and
  move focus to the summary (or to the first invalid field for short forms).
- Never clear the user's input because of an error.
- Errors are announced: `aria-invalid="true"` plus `aria-describedby` pointing at the message (the
  library inputs do this when `error` is set).

## FORM-6 - Buttons in forms

- One primary submit button with a specific label ("Create account", "Save changes"). Put it at the
  end of the form, left-aligned with the fields in single-column forms, or right-aligned in dialog
  footers.
- Put Cancel or Back before it as `secondary`/`ghost`. Avoid a "Reset/Clear form" button, since
  users press it by accident (NN/g).
- Don't disable submit to signal invalid fields (CHOOSE-ACTION-2). Do show `loading` while
  submitting, and prevent double submission.

## FORM-7 - Input efficiency

- Use the correct `type`, `inputMode` and `autoComplete` (WCAG 1.3.5) for email, tel, url, number,
  name, address and one-time codes.
- Use sensible defaults, and pre-fill what you know. Don't ask for information you can derive (city
  from ZIP).
- Accept input in any reasonable format (spaces in card numbers, dashes in phone numbers) and
  normalize it yourself. `formatMask` / `inputFilter` help. Don't reject what users type.
- Allow paste everywhere, including password and confirmation fields (WCAG 3.3.8).

## FORM-8 - Long forms

- More than ~7 fields → group them under section headings. More than ~3 groups in a linear flow →
  `Stepper` with a review step.
- Save drafts for long forms, and warn before navigating away with unsaved changes.
- Show progress ("Step 2 of 4") and let users go back without losing data.

## FORM-9 - Choice controls inside forms

Follow CHOOSE-INPUT-3 to CHOOSE-INPUT-5. In particular, use radio buttons (not a Select) for 2–5
options, and a Checkbox (not a Toggle) inside forms that submit later.

## FORM-10 - Read-only and disabled

- Read-only (`readOnly`): the value matters and can be selected or copied, but can't be edited. It
  keeps its normal contrast.
- Disabled: not applicable right now. Explain why nearby when the reason isn't obvious. Disabled
  fields aren't submitted.

## FORM-11 - Settings pages

Settings that apply instantly use `Toggle`, `Select` and `RadioGroup` with immediate save, and a
toast confirmation ("Saved") only when the save is asynchronous. Don't mix instant-save controls
and a Save button in the same section.

## FORM-12 - FormBuilder

Use `FormBuilder` for config-driven forms (admin CRUD, generated settings). It enforces consistent
spacing, labels and validation. Hand-compose with inputs when the form needs custom layout or
interleaved content.
