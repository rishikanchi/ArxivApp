# Arxiv Research Explorer

An interactive web application for visualizing and exploring academic research papers using AI-powered search and advanced data visualization.

<a id="readme-top"></a>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#architecture">Architecture</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

**Arxiv Research Explorer** is a cutting-edge web application that transforms how researchers discover and explore academic papers. By leveraging advanced machine learning and data visualization techniques, this platform provides an intuitive interface for navigating the complex landscape of scientific research.

### Key Features

✅ **AI-Powered Research Discovery** - Natural language queries mapped to research space coordinates using ALBERT embeddings and MLP prediction

✅ **Interactive Visualization** - Explore 100,000+ papers in an intuitive 2D scatter plot with LightningChart JS for 60fps performance

✅ **Intelligent Clustering** - Automatic identification of 20 research domains using KMeans clustering on UMAP coordinates

✅ **Personalized Collections** - Save and organize your favorite research papers with local storage persistence

✅ **Real-time Analysis** - Instant feedback and AI-generated abstract summaries using ChatGPT integration

✅ **User Authentication** - Secure signup/login system with session management and protected routes

✅ **Responsive Design** - Modern, mobile-friendly interface with Tailwind CSS styling

### Research Categories

The application supports 20 research domains:

- Astrophysics
- Condensed Material Physics
- Computer Science
- Economics
- Electrical Engineering and Systems Science
- General Relativity and Quantum Cosmology
- High Energy Physics (Experiment, Lattice, Phenomenology, Theory)
- Mathematics and Mathematical Physics
- Nonlinear Sciences
- Nuclear Physics (Experiment, Theory)
- Physics
- Quantitative Biology and Finance
- Quantum Physics
- Statistics

### Built With

This project leverages a powerful technology stack combining modern web development with advanced machine learning:

#### Frontend Technologies

- [![Express.js][Express.js]][Express-url]
- [![EJS][EJS]][EJS-url]
- [![TailwindCSS][TailwindCSS]][TailwindCSS-url]
- [![LightningChart][LightningChart]][LightningChart-url]
- [![FontAwesome][FontAwesome]][FontAwesome-url]

#### Backend Technologies

- [![Node.js][Node.js]][Node-url]
- [![MongoDB][MongoDB]][MongoDB-url]
- [![Express][Express.js]][Express-url]
- [![Flask][Flask]][Flask-url]

#### Machine Learning & Data Science

- [![Python][Python]][Python-url]
- [![PyTorch][PyTorch]][PyTorch-url]
- [![Transformers][Transformers]][Transformers-url]
- [![Scikit-learn][Scikit-learn]][Scikit-learn-url]
- [![Pandas][Pandas]][Pandas-url]
- [![UMAP][UMAP]][UMAP-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Get a local copy up and running with these simple steps.

### Prerequisites

Ensure you have the following installed:

- Node.js 14+
- Python 3.8+
- MongoDB Atlas account
- RapidAPI account (for ChatGPT integration)

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/rishikanchi/ArxivApp.git
   cd ArxivApp
   ```

2. **Install Node.js dependencies**

   ```sh
   npm install
   ```

3. **Install Python dependencies**

   ```sh
   pip install pymongo pandas scikit-learn torch transformers flask
   ```

4. **Set up MongoDB**

   - Create a MongoDB Atlas cluster
   - Update the connection string in `config.js`

   ```js
   export const mongoDBURL = "your_mongodb_atlas_connection_string";
   ```

5. **Load data into MongoDB**

   ```bash
   python data_loader.py
   python cluster_loader.py
   ```

6. **Configure API keys**

   - Update the RapidAPI key in `get_new_embedding.py`

   ```python
   headers = {
       'x-rapidapi-key': 'your_rapidapi_key',
       'x-rapidapi-host': 'free-chatgpt-api.p.rapidapi.com'
   }
   ```

7. **Start the services**

   - In one terminal: Start the Flask API

     ```bash
     python get_new_embedding.py
     ```

   - In another terminal: Start the Express server

     ```bash
     npm start
     # For development with auto-reload
     npm run dev
     ```

8. **Access the application**

   - Open your browser to `http://localhost:5555`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### Basic Workflow

1. **Sign Up / Log In**

   - Create an account or log in to existing one
   - Authentication state persists across sessions

2. **Explore Research**

   - Enter your research query in natural language
   - Click "Explore" to visualize related papers
   - The system automatically zooms to relevant research areas

3. **Discover Papers**

   - Click on any point in the scatter plot
   - View paper title, category, and AI-generated abstract
   - Access the full paper on arXiv

4. **Save Favorites**

   - Bookmark interesting papers
   - Access your collection from "My Papers"
   - Organize and manage your research

### Advanced Features

- **Category Filtering**: Visual distinction between 20 research domains
- **Cluster Analysis**: Identify research trends and domains
- **Real-time Processing**: Instant feedback during interactions
- **Responsive Design**: Works seamlessly on desktop and mobile

### Example Queries

```
"Quantum computing applications in machine learning"
"Recent advances in neural network architectures"
"Renewable energy storage technologies"
"COVID-19 epidemiological modeling"
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ARCHITECTURE -->

## Architecture

### System Overview

```
┌───────────────────────────────────────────────────────────────┐
│                        Arxiv Research Explorer                  │
├─────────────────┬─────────────────┬─────────────────┬─────────────┤
│   Frontend      │    Backend      │   Machine       │   Database   │
│                 │                 │   Learning      │              │
├─────────────────┼─────────────────┼─────────────────┼─────────────┤
│ EJS Templates   │ Express Server  │ ALBERT Model    │ MongoDB     │
│ Tailwind CSS    │ REST API        │ UMAP Reduction  │ Atlas       │
│ LightningChart  │ Authentication  │ MLP Prediction  │ Collections │
│ JavaScript      │ Session Mgmt    │ PyTorch         │ Indexes     │
└─────────────────┴─────────────────┴─────────────────┴─────────────┘
```

### Data Flow

```
1. User Query → 2. Flask API → 3. Text Embedding → 4. Coordinate Prediction
                      ↓
                  5. MongoDB Query → 6. Data Visualization → 7. User Interaction
```

### Component Diagram

```
[User Browser] ←→ [Express Server] ←→ [MongoDB]
       ↓
[LightningChart] ←→ [Flask API] ←→ [PyTorch Model]
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Core visualization engine
- [x] MongoDB data integration
- [x] User authentication system
- [x] AI-powered search functionality
- [x] Paper saving and management
- [x] Cluster analysis and labeling
- [ ] Advanced search with filters
- [ ] Collaboration features
- [ ] Export functionality (PDF/PNG)
- [ ] Mobile application
- [ ] Citation network visualization
- [ ] Research trend analysis
- [ ] Personalized recommendations
- [ ] Multi-language support
- [ ] Dark mode UI
- [ ] Accessibility improvements

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
   ```sh
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```sh
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```sh
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and patterns
- Write comprehensive tests for new features
- Update documentation for changes
- Keep pull requests focused and atomic
- Include screenshots for UI changes

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Follow GitHub community guidelines
- Maintain professional communication

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the ISC License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Rishi Kanchi - me [at] rishikanchi [dot] com

Ryan Barretto

Jason Zhou

Project Link: [https://github.com/rishikanchi/ArxivApp](https://github.com/rishikanchi/ArxivApp)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

This project wouldn't be possible without these amazing resources and technologies:

- [arXiv](https://arxiv.org/) - For providing the research paper dataset
- [LightningChart](https://www.arction.com/lightningchart-js/) - High-performance visualization library
- [HuggingFace Transformers](https://huggingface.co/) - State-of-the-art NLP models
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud database service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) - Icon library
- [UMAP](https://umap-learn.readthedocs.io/) - Dimensionality reduction
- [PyTorch](https://pytorch.org/) - Machine learning framework

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/rishikanchi/ArxivApp.svg?style=for-the-badge
[contributors-url]: https://github.com/rishikanchi/ArxivApp/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/rishikanchi/ArxivApp.svg?style=for-the-badge
[forks-url]: https://github.com/rishikanchi/ArxivApp/network/members
[stars-shield]: https://img.shields.io/github/stars/rishikanchi/ArxivApp.svg?style=for-the-badge
[stars-url]: https://github.com/rishikanchi/ArxivApp/stargazers
[issues-shield]: https://img.shields.io/github/issues/rishikanchi/ArxivApp.svg?style=for-the-badge
[issues-url]: https://github.com/rishikanchi/ArxivApp/issues
[license-shield]: https://img.shields.io/github/license/rishikanchi/ArxivApp.svg?style=for-the-badge
[license-url]: https://github.com/rishikanchi/ArxivApp/blob/master/LICENSE

<!-- Technology Stack Badges -->

[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[EJS]: https://img.shields.io/badge/EJS-000000?style=for-the-badge&logo=ejs&logoColor=white
[EJS-url]: https://ejs.co/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[LightningChart]: https://img.shields.io/badge/LightningChart-0078D4?style=for-the-badge&logo=lightning&logoColor=white
[LightningChart-url]: https://www.arction.com/lightningchart-js/
[FontAwesome]: https://img.shields.io/badge/Font_Awesome-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white
[FontAwesome-url]: https://fontawesome.com/
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Flask]: https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white
[Flask-url]: https://flask.palletsprojects.com/
[Python]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org/
[PyTorch]: https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white
[PyTorch-url]: https://pytorch.org/
[Transformers]: https://img.shields.io/badge/Transformers-FF6B00?style=for-the-badge&logo=huggingface&logoColor=white
[Transformers-url]: https://huggingface.co/
[Scikit-learn]: https://img.shields.io/badge/Scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white
[Scikit-learn-url]: https://scikit-learn.org/
[Pandas]: https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white
[Pandas-url]: https://pandas.pydata.org/
[UMAP]: https://img.shields.io/badge/UMAP-4E79A7?style=for-the-badge&logo=umap&logoColor=white
[UMAP-url]: https://umap-learn.readthedocs.io/
