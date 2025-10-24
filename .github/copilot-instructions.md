# GitHub Copilot Instructions

## Project Overview
Photo2Profit is a next-generation AI resale tool that transforms any photo into a ready-to-sell product listing. Built for creators, thrifters, and e-commerce entrepreneurs, it uses advanced AI to identify products, clean images, suggest optimized prices, and generate listings that sell themselves.

## Project Goals
- Provide AI-powered product identification from photos
- Clean and enhance product images automatically
- Generate optimized pricing suggestions
- Create compelling product listings for e-commerce platforms
- Support creators, thrifters, and e-commerce entrepreneurs

## Coding Standards

### General Guidelines
- Write clean, readable, and maintainable code
- Follow DRY (Don't Repeat Yourself) principles
- Use meaningful variable and function names
- Add comments for complex logic or non-obvious code
- Keep functions small and focused on a single responsibility

### Documentation
- All public functions and classes should have clear documentation
- Include usage examples for complex features
- Update README.md when adding new features or changing setup instructions
- Document API endpoints with request/response examples

### Testing
- Write unit tests for all new features
- Ensure tests are comprehensive and cover edge cases
- Run all tests before committing changes
- Maintain or improve code coverage with each change

### Code Review
- All code changes should be reviewed before merging
- Address all review comments before merging
- Ensure CI/CD checks pass before requesting review

## Best Practices

### AI/ML Components
- Document model versions and training data sources
- Include error handling for AI service failures
- Implement fallback mechanisms for when AI services are unavailable
- Log AI predictions for debugging and improvement

### Image Processing
- Validate image formats and sizes before processing
- Implement efficient image compression and optimization
- Handle various image orientations and resolutions
- Ensure privacy and security when handling user images

### E-commerce Integration
- Support multiple e-commerce platforms
- Handle API rate limits gracefully
- Implement robust error handling for external API calls
- Cache responses when appropriate to reduce API calls

### Performance
- Optimize for fast image processing
- Use asynchronous operations for I/O-bound tasks
- Implement caching strategies for frequently accessed data
- Monitor and log performance metrics

### Security
- Never commit sensitive information (API keys, secrets, etc.)
- Use environment variables for configuration
- Validate and sanitize all user inputs
- Implement proper authentication and authorization
- Follow OWASP security guidelines

## Development Workflow

### Getting Started
1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run tests to verify setup
5. Start development server

### Making Changes
1. Create a feature branch from main
2. Make small, focused commits
3. Write or update tests for your changes
4. Run linter and tests locally
5. Push changes and create a pull request
6. Address review comments
7. Merge after approval and passing CI/CD

### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep the first line under 50 characters
- Add detailed description if needed

## Project Structure
(To be updated as the project grows)

```
photo2profitai/
├── .github/              # GitHub configuration and workflows
│   └── copilot-instructions.md
├── README.md            # Project documentation
└── .gitignore          # Git ignore rules
```

## Tech Stack
(To be defined as the project develops)

The tech stack will be determined based on the project requirements. Consider:
- Modern web framework (React, Vue, Next.js, etc.)
- Backend framework (Node.js, Python, Go, etc.)
- AI/ML services for image recognition and text generation
- Image processing libraries
- Database for storing product listings
- Cloud storage for images

## Future Considerations
- Scalability for handling multiple users
- Real-time processing capabilities
- Mobile app support
- Integration with popular e-commerce platforms
- Multi-language support
- Analytics and reporting features
