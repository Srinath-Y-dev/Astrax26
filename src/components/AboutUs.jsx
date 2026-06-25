import aboutVideo from "../assets/about-bg.mp4";
import chairmanImg from "../assets/chairman_img.jpg";
import citImage from "../assets/CIT_image.png";
import clubImg from "../assets/club_img.jpeg";
import { motion } from "framer-motion";
import "../styles/AboutUs.css";

const aboutSections = [
  {
    eyebrow: "About College",
    title: "Chennai Institute of Technology",
    mediaLabel: "College Photo",
    mediaImage: citImage,
    layout: "media-left",
    imageFit: "cover",
    body: [
      "Chennai Institute of Technology (CIT Chennai) is an industry-connected autonomous institute and a co-educational engineering college located in Kundrathur, Chennai, Tamil Nadu, India.",
      "Established in 2010 by the Parthasarathy Seeniammal Educational Trust, Chennai Institute of Technology is one of the top colleges in Tamil Nadu with an objective of providing quality technical education with adequate industrial exposure than any other college in Chennai.",
      "Its vision is to be an eminent centre for Academia, Industry and Research by imparting knowledge, relevant practices and inculcating human values to address global challenges through novelty and sustainability."
    ]
  },
  {
    eyebrow: "About Athera Club",
    title: "ATHERA",
    mediaLabel: "Athera Club Photo",
    mediaImage: clubImg,
    layout: "media-right",
    imageFit: "contain",
    body: [
      "ATHERA is a specialized technical club under the Department of CSE (AI & ML) at Chennai Institute of Technology.",
      "The club focuses on emerging areas such as AI agent development, Large Language Models (LLMs), intelligent automation, and advanced ML techniques.",
      "ATHERA bridges academia and industry through hands-on workshops, hackathons, research initiatives, and collaborative projects."
    ]
  }
];

function AboutPhoto({ label, image, imageFit, variants }) {
  return (
    <motion.div className="about-photo-placeholder" aria-label={label} variants={variants}>
      <img 
        src={image} 
        alt={label} 
        className={`about-photo-image ${imageFit === "contain" ? "fit-contain" : "fit-cover"}`} 
      />
    </motion.div>
  );
}

function AboutSection({ section }) {
  const mediaVariants = section.layout === "media-left" 
    ? { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } }
    : { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } };

  const media = <AboutPhoto label={section.mediaLabel} image={section.mediaImage} imageFit={section.imageFit} variants={mediaVariants} />;

  return (
    <motion.article 
      className={`about-story-card ${section.layout}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-100px" }}
    >
      {section.layout === "media-left" && media}

      <motion.div 
        className="about-story-copy"
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } } }}
      >
        <span className="about-card-badge">{section.eyebrow}</span>
        <h3>{section.title}</h3>
        {section.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </motion.div>

      {section.layout === "media-right" && media}
    </motion.article>
  );
}

function AboutUs() {
  return (
    <section className="about-section">
      <video autoPlay muted loop playsInline className="about-video-bg">
        <source src={aboutVideo} type="video/mp4" />
      </video>
      <div className="about-video-overlay"></div>

      <div className="about-glow about-glow-1"></div>
      <div className="about-glow about-glow-2"></div>

      <div className="about-container">
        <motion.header 
          className="about-hero"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
        >
          <motion.span 
            className="about-hero-kicker"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
          >
            Department of CSE (AI & ML)
          </motion.span>
          <motion.h2 variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } } }}>
            About Us
          </motion.h2>
          <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
            ATHERA connects technical curiosity, institutional excellence, and
            visionary leadership into a space for students to build, research,
            compete, and collaborate.
          </motion.p>
        </motion.header>

        <div className="about-stories">
          {aboutSections.map((section) => (
            <AboutSection key={section.eyebrow} section={section} />
          ))}
        </div>

        <motion.article 
          className="about-chairman-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <motion.div 
            className="chairman-signal"
            variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
          >
            <img src={chairmanImg} alt="Shri. P. Sriram" className="chairman-photo" />
          </motion.div>
          <motion.div 
            className="chairman-content"
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } } }}
          >
            <span className="about-card-badge">About Chairman</span>
            <h3>Shri. P. Sriram</h3>
            <p>
              Shri. P. Sriram, Chairman of Chennai Institute of Technology, is a
              visionary entrepreneur and educationist dedicated to transforming
              technical education. His leadership and commitment to innovation,
              industry collaboration, and student success have played a pivotal
              role in establishing CIT as one of Tamil Nadu's leading engineering
              institutions.
            </p>
          </motion.div>
        </motion.article>
      </div>
    </section>
  );
}

export default AboutUs;
