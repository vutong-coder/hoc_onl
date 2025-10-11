# Effects Guide - Synchronized with Certify Page

This guide explains how to use the global effect classes that are synchronized with the certify page design system.

## Available Effect Classes

### 1. Card Hover Effect
**Class:** `.card-hover-effect`

Perfect for large cards like certification cards, contest cards, etc.

**Features:**
- Smooth lift animation (`translateY(-8px) scale(1.02)`)
- Enhanced shadow on hover
- Subtle gradient overlay
- Blue border highlight

**Usage:**
```html
<div className="card-hover-effect">
  Your card content
</div>
```

**CSS Properties:**
```css
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
transform: translateY(-8px) scale(1.02); /* on hover */
```

---

### 2. Button Hover Effect
**Class:** `.button-hover-effect`

For primary action buttons.

**Features:**
- Lift animation
- Glow effect
- Ripple effect on click
- Smooth transitions

**Usage:**
```html
<button className="button-hover-effect">
  Click Me
</button>
```

**CSS Properties:**
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
transform: translateY(-2px); /* on hover */
```

---

### 3. Subtle Hover Effect
**Class:** `.subtle-hover-effect`

For smaller cards or less prominent elements.

**Features:**
- Gentle lift (`translateY(-4px)`)
- Subtle shadow
- No scale effect

**Usage:**
```html
<div className="subtle-hover-effect">
  Smaller card content
</div>
```

---

### 4. Link Hover Effect
**Class:** `.link-hover-effect`

For text links and navigation items.

**Features:**
- Underline animation
- Smooth color transition
- Scale effect on click

**Usage:**
```html
<a className="link-hover-effect">
  Click here
</a>
```

---

### 5. Icon Button Hover
**Class:** `.icon-button-hover`

For icon-only buttons (like info buttons).

**Features:**
- Scale and rotate animation
- Shadow on hover
- Playful interaction

**Usage:**
```html
<button className="icon-button-hover">
  ℹ️
</button>
```

---

### 6. Badge Hover Effect
**Class:** `.badge-hover-effect`

For badges, tags, and small labels.

**Features:**
- Subtle scale (`scale(1.05)`)
- Soft shadow
- Quick transition

**Usage:**
```html
<span className="badge-hover-effect">
  Badge
</span>
```

---

### 7. Input Focus Effect
**Class:** `.input-focus-effect`

For form inputs and textareas.

**Features:**
- Blue border on focus
- Soft glow
- Lift animation

**Usage:**
```html
<input className="input-focus-effect" />
```

---

## Animation Utilities

### Pulse Effect
**Class:** `.pulse-effect`

Adds a subtle pulsing animation. Good for "new" badges or important notifications.

```html
<div className="pulse-effect">
  New!
</div>
```

---

### Ripple Effect
**Class:** `.ripple-effect`

Adds a material-design-like ripple on click.

```html
<button className="ripple-effect">
  Click Me
</button>
```

---

### Page Transition
**Class:** `.page-transition`

Adds a fade-in animation when the page loads.

```html
<div className="page-transition">
  Page content
</div>
```

---

## Best Practices

### 1. Don't Overuse Effects
Use effects strategically:
- **Cards**: Use `card-hover-effect` or `subtle-hover-effect`
- **Buttons**: Use `button-hover-effect`
- **Links**: Use `link-hover-effect`
- **Icons**: Use `icon-button-hover`

### 2. Maintain Consistency
All effects are designed to work together. Using them consistently across the app creates a cohesive experience.

### 3. Performance
Effects use `transform` and `opacity` which are GPU-accelerated. Avoid animating properties like `width`, `height`, or `left/right`.

### 4. Accessibility
All effects maintain focus states and keyboard navigation. Test with keyboard-only navigation.

---

## Customization in CSS Modules

If you need to customize effects in a specific component:

```css
.myCard {
  /* Your base styles */
}

.myCard:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}
```

---

## Dark Mode

All effects automatically adjust for dark mode with appropriate shadow intensities and colors.

---

## Easing Functions

The standard easing function is: `cubic-bezier(0.4, 0, 0.2, 1)`

This provides a smooth, natural-feeling animation that:
- Starts quickly
- Eases out smoothly
- Feels responsive

---

## Examples from Certify Page

### Certification Card
```jsx
<div className={styles.card}> {/* Uses card-hover-effect internally */}
  <h3>Frontend Developer</h3>
  <button className={styles.getCertifiedButton}>Get Certified</button>
</div>
```

### Contest Card
```jsx
<div className={styles.contestCard}> {/* Uses card-hover-effect */}
  <h3>JavaScript Challenge</h3>
  <button className={styles.actionButton}>View Challenges</button>
</div>
```

---

## Questions or Issues?

If you notice inconsistent animations or need a new effect type, please:
1. Check this guide first
2. Review `src/assets/css/effects.css`
3. Reference the certify page implementation
4. Create a new effect class if needed (and document it here!)

