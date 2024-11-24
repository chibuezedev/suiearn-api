## Branching and Deployment Guidelines

### Branch Structure

- **`dev` Branch**:
  - This branch serves as the staging environment.
  - All development code should be committed and thoroughly tested in this branch.
  - New features and bug fixes should be tested here before they are considered for production.

- **`main` Branch**:
  - This branch serves as the production environment.
  - Only fully tested and conflict-free code from the `dev` branch should be merged here.
  - Merges to `main` should be carefully reviewed to ensure stability and integrity of the production environment.

### Workflow and Best Practices

1. **Development and Testing**:
   - Perform all development activities in the `dev` branch.
   - Ensure comprehensive testing of all changes before merging them into `main`.

2. **Merging to `main`**:
   - Before merging, ensure there are no conflicts between `dev` and `main`.
   - Conduct a thorough code review and testing to guarantee that the code is stable and production-ready.

3. **Pipeline and Build**:
