# Contributing to Algorythmos AI Agents

Thank you for your interest in contributing to Algorythmos AI Agents! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend/worker)
- **Docker** and **Docker Compose**
- **Git**

### Development Setup

1. **Fork and Clone**
   ```bash
git clone https://github.com/your-username/algorythmos-ai-agents.git
cd algorythmos-ai-agents
   ```

2. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd apps/web && npm install && cd ../..
   
   # Install Python dependencies
   cd apps/api-python && pip install -r requirements.txt && cd ../..
   cd apps/worker-python && pip install -r requirements.txt && cd ../..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment templates
   cp env.python.example .env
   
   # Edit .env with your configuration
   # Required: OPENAI_API_KEY, ANTHROPIC_API_KEY, SMTP_* variables
   ```

4. **Start Development Environment**
   ```bash
   # Using Docker Compose (recommended)
   ./start-python.sh
   
   # Or manually
   docker-compose up -d
   ```

## 🏗️ Project Structure

```
algorythmos-ai-agents/
├── apps/
│   ├── web/                 # Next.js Frontend
│   ├── api-python/          # FastAPI Backend
│   └── worker-python/       # Celery Worker
├── k8s/                     # Kubernetes Manifests
├── docs/                    # Documentation
├── scripts/                 # Utility Scripts
└── docker-compose.yml       # Docker Configuration
```

## 🔧 Development Workflow

### 1. Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: New features (`feature/workflow-builder`)
- **bugfix/**: Bug fixes (`bugfix/email-sending`)
- **hotfix/**: Critical fixes (`hotfix/security-patch`)

### 2. Making Changes

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... code changes ...

# Test your changes
npm test
python -m pytest

# Commit with conventional commits
git commit -m "feat: add new workflow step type"
```

### 3. Conventional Commits

Use conventional commit format:

```
type(scope): description

feat: new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

Examples:
- `feat(api): add new connector endpoint`
- `fix(worker): resolve celery task timeout`
- `docs: update deployment guide`

## 🧪 Testing

### Frontend Testing
```bash
cd apps/web
npm test
npm run test:coverage
```

### Backend Testing
```bash
cd apps/api-python
pytest
pytest --cov=app
```

### Integration Testing
```bash
# Run full test suite
npm run test:integration
```

## 📝 Code Style

### TypeScript/JavaScript
- Use ESLint and Prettier
- Follow Next.js best practices
- Use TypeScript strict mode

### Python
- Follow PEP 8
- Use Black for formatting
- Use type hints
- Docstrings for functions/classes

### Example Python Function
```python
def execute_workflow(workflow_id: str, user_id: str) -> Dict[str, Any]:
    """
    Execute a workflow with the given ID.
    
    Args:
        workflow_id: The UUID of the workflow to execute
        user_id: The ID of the user executing the workflow
        
    Returns:
        Dictionary containing execution results and status
        
    Raises:
        WorkflowNotFoundError: If workflow doesn't exist
        ExecutionError: If workflow execution fails
    """
    # Implementation here
    pass
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment**: OS, Node.js version, Python version
2. **Steps to Reproduce**: Clear, numbered steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots/Logs**: If applicable
6. **Error Messages**: Full error text

### Bug Report Template
```markdown
## Bug Description
Brief description of the bug

## Environment
- OS: [e.g., macOS 13.0]
- Node.js: [e.g., 18.17.0]
- Python: [e.g., 3.11.5]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Additional Context
Any other context about the problem
```

## ✨ Feature Requests

For feature requests:

1. **Check existing issues** first
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Provide examples** if possible
5. **Consider implementation** complexity

### Feature Request Template
```markdown
## Feature Description
Brief description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this work?

## Alternatives Considered
What other approaches were considered?

## Additional Context
Any other context or screenshots
```

## 🔒 Security

### Reporting Security Issues

**Do NOT** report security vulnerabilities through public GitHub issues.

Instead:
1. Email security issues to: security@your-domain.com
2. Include detailed description and steps to reproduce
3. Wait for response before public disclosure

### Security Best Practices

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate all inputs
- Follow OWASP guidelines
- Keep dependencies updated

## 📚 Documentation

### Adding Documentation

1. **Code Documentation**: Inline comments and docstrings
2. **API Documentation**: Update OpenAPI specs
3. **User Documentation**: Update README and docs/
4. **Architecture Documentation**: Update docs/architecture.md

### Documentation Standards

- Use clear, concise language
- Include code examples
- Keep documentation up-to-date
- Use proper markdown formatting

## 🚀 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Add tests** for new features
4. **Ensure all tests pass**
5. **Follow code style guidelines**

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** verification
4. **Documentation** review
5. **Approval** from maintainers

## 🏷️ Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped
- [ ] Release notes prepared
- [ ] Docker images built
- [ ] Kubernetes manifests updated

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards others

### Getting Help

- **GitHub Discussions**: For questions and ideas
- **GitHub Issues**: For bugs and feature requests
- **Discord/Slack**: For real-time chat (if available)

## 🎯 Areas for Contribution

### High Priority
- **Testing**: Improve test coverage
- **Documentation**: Enhance guides and examples
- **Performance**: Optimize workflow execution
- **Security**: Security audits and improvements

### Good First Issues
- Fix typos in documentation
- Add unit tests for existing functions
- Improve error messages
- Add new connector types

### Advanced
- Implement new workflow step types
- Add monitoring and observability
- Optimize database queries
- Add multi-tenant support

## 📞 Contact

- **Maintainer**: [Your Name](mailto:your-email@example.com)
- **GitHub**: [@your-username](https://github.com/your-username)
- **Discord**: [Join our server](https://discord.gg/your-server)

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Algorythmos AI Agents! 🎉
