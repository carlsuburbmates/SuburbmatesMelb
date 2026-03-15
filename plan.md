1. **Target**: `src/app/auth/login/page.tsx` and `src/app/auth/signup/page.tsx`.
2. **Issue**: The buttons for showing/hiding passwords (`showPassword`, `showConfirmPassword`) lack `aria-label`s, rendering them inaccessible to screen readers. Users won't know what these icon-only buttons do.
3. **Fix**: Add dynamic `aria-label` attributes to these toggle buttons.
   - When `showPassword` is false: `aria-label="Show password"`
   - When `showPassword` is true: `aria-label="Hide password"`
4. **Pre-commit**: Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
