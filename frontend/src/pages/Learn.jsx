import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiBook, FiCheckSquare, FiAward } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../ui/Navbar";
import Confetti from "react-confetti";
import "../styles/Learn.css";

const systemMessage = {
  role: "system",
  content: "You are an intelligent tutoring system designed to create unique, challenging, and context-specific practice questions. Avoid repeating questions and ensure each question is distinct, relevant to the user's subject, and includes a clear explanation. Use markdown formatting for code snippets.",
};

export default function PracticePage() {
  const [practiceData, setPracticeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [userPresent, setUserPresent] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [askedQuestions, setAskedQuestions] = useState(new Set());
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const practiceTopics = [
    { id: 1, name: "MCQ", icon: <FiCheckSquare /> },
    { id: 2, name: "Quizzes", icon: <FiBook /> },
    { id: 3, name: "Assignments", icon: <FiAward /> },
  ];

  // Fetch user data
  useEffect(() => {
    if (id && id !== "example") {
      const fetchData = async () => {
        try {
          const response = await fetch(`https://backend.flaap.me/api/user-info/${id}`);
          const resData = await response.json();

          if (resData.success === false) {
            setUserPresent(false);
            setLoadingUser(false);
            return;
          }

          const selectedUrl = resData.user.selected_url;
          if (selectedUrl !== "default_url") {
            setRedirecting(true);
            window.location.href = resData.user[selectedUrl];
            return;
          }

          setUserInfo(resData.user);
          setLoadingUser(false);
          setUserPresent(true);
        } catch (err) {
          setError(err.message);
          setLoadingUser(false);
        }
      };

      fetchData();
    } else {
      setLoadingUser(false);
    }
  }, [id]);

  const fetchPracticeContent = async (topic) => {
    if (!userInfo?.user_field) {
      setError("User subject not available.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: "Bearer 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",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.2-11b-vision-instruct:free",
          messages: [
            systemMessage,
            {
              role: "user",
              content: `Generate a unique, engaging ${topic.name} question about ${userInfo.user_field} that relates to real-world scenarios or applications. Ensure the question is distinct from previous ones in this session. Provide 4 distinct multiple choice options and a detailed explanation. Return the response as a JSON object in this exact format:
              {
                "question": "string",
                "options": ["string", "string", "string", "string"],
                "correctAnswer": "string",
                "explanation": "string"
              }`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error(`Failed to fetch practice content: ${response.statusText}`);

      const data = await response.json();
      const contentString = data.choices[0].message.content;

      let content;
      try {
        content = JSON.parse(contentString);
      } catch (jsonError) {
        console.warn("Content is not valid JSON, attempting manual parsing:", jsonError);
        content = parsePlainTextToQuestion(contentString);
      }

      if (!content.question || !Array.isArray(content.options) || content.options.length !== 4 || !content.correctAnswer || !content.explanation) {
        throw new Error("Invalid or incomplete content format received from API");
      }

      if (askedQuestions.has(content.question)) {
        console.log("Duplicate question detected, fetching another...");
        return fetchPracticeContent(topic);
      }

      setAskedQuestions(prev => new Set(prev).add(content.question));
      setPracticeData(prev => [...prev, {
        id: Date.now(),
        type: topic.name,
        question: content.question,
        options: content.options,
        correctAnswer: content.correctAnswer,
        explanation: content.explanation,
      }]);
    } catch (err) {
      setError(err.message || "Failed to generate a valid question.");
    } finally {
      setIsLoading(false);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const parsePlainTextToQuestion = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    let question = '';
    const options = [];
    let correctAnswer = '';
    let explanation = '';

    lines.forEach(line => {
      if (line.match(/question:/i)) question = line.replace(/question:/i, '').trim();
      else if (line.match(/[A-D]\)/i)) options.push(line.replace(/[A-D]\)/i, '').trim());
      else if (line.match(/correct answer:/i)) correctAnswer = line.replace(/correct answer:/i, '').trim();
      else if (line.match(/explanation:/i)) explanation = line.replace(/explanation:/i, '').trim();
    });

    return {
      question: question || "What is a key concept in " + (userInfo?.user_field || "this subject") + "?",
      options: options.length === 4 ? options : ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: correctAnswer || options[0] || "Option A",
      explanation: explanation || "This is a default explanation as the API did not provide one.",
    };
  };

  const handleAnswerSubmit = (questionId, selectedOption) => {
    const question = practiceData.find(q => q.id === questionId);
    const isCorrect = question.correctAnswer === selectedOption;

    setUserAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption,
    }));

    setProgress(prev => Math.min(prev + 10, 100));
    setScore(prev => prev + (isCorrect ? 10 : 0));

    setTimeout(() => {
      if (selectedTopic && practiceData.length < 10) {
        fetchPracticeContent(selectedTopic);
        setPracticeData(prev => prev.filter(q => q.id !== questionId));
      }
    }, 1500);
  };

  const resetProgress = () => {
    setPracticeData([]);
    setUserAnswers({});
    setProgress(0);
    setScore(0);
    setSelectedTopic(null);
    setAskedQuestions(new Set());
  };

  const renderQuestion = (item) => (
    <motion.div
      key={item.id}
      className="practice-card bg-white p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="question-header flex items-center gap-2">
        <span className="topic-badge bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.type}</span>
        <h3 className="text-lg font-semibold">{item.question}</h3>
      </div>

      <div className="options-grid grid grid-cols-1 gap-3 mt-4">
        {item.options.map((option, index) => {
          const isSelected = userAnswers[item.id] === option;
          const isCorrect = item.correctAnswer === option;
          return (
            <motion.button
              key={index}
              className={`option-button p-3 rounded-lg text-left transition-all duration-300 ${
                userAnswers[item.id]
                  ? isSelected && isCorrect
                    ? 'bg-green-100 text-green-800'
                    : isSelected
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => handleAnswerSubmit(item.id, option)}
              disabled={userAnswers[item.id]}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {String.fromCharCode(65 + index)}. {option}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {userAnswers[item.id] && (
          <motion.div
            className="explanation-box mt-4 p-4 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className={item.correctAnswer === userAnswers[item.id] ? 'text-green-600' : 'text-red-600'}>
              {item.correctAnswer === userAnswers[item.id] ? "Correct! " : "Incorrect. "}
              {item.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (loadingUser) return <div>Loading user data...</div>;
  if (redirecting) return <div>Redirecting...</div>;
  if (!userPresent) return <div>User not found.</div>;

  return (
    <div className="practice-page min-h-screen bg-gray-50">
      <Navbar />
      {progress >= 100 && <Confetti recycle={false} numberOfPieces={200} />}
      <div className="practice-container max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6">
        <motion.div
          className="sidebar w-full md:w-1/4 bg-white p-4 rounded-lg shadow"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">Practice Topics</h2>
          <div className="topics-list space-y-2">
            {practiceTopics.map(topic => (
              <motion.button
                key={topic.id}
                className={`topic-button w-full flex items-center gap-2 p-3 rounded-lg transition-all ${
                  selectedTopic?.id === topic.id ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setSelectedTopic(topic);
                  fetchPracticeContent(topic);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {topic.icon}
                {topic.name}
              </motion.button>
            ))}
          </div>
          <div className="progress-section mt-6">
            <h3 className="text-lg font-semibold">Your Progress</h3>
            <div className="progress-bar bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
              <motion.div
                className="progress-fill h-full bg-gradient-to-r from-blue-400 to-green-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="mt-1 text-sm">{progress}% Complete</p>
            <p className="text-sm">Score: {score}</p>
            {progress >= 100 && (
              <motion.div
                className="achievement-badge flex items-center gap-2 mt-4 p-2 bg-yellow-100 rounded-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <FiAward className="text-yellow-500" />
                <span className="text-yellow-700">Course Master!</span>
              </motion.div>
            )}
            <button
              className="mt-4 w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              onClick={resetProgress}
            >
              Reset Progress
            </button>
          </div>
        </motion.div>
        <div className="main-content w-full md:w-3/4 space-y-6">
          {isLoading ? (
            <motion.div
              className="loading-state flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="loader w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-2">Generating practice question...</p>
            </motion.div>
          ) : error ? (
            <div className="error-state text-center">
              <p className="text-red-500">Error: {error}</p>
              <button
                className="mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => fetchPracticeContent(selectedTopic)}
              >
                Retry
              </button>
            </div>
          ) : practiceData.length === 0 ? (
            <motion.div
              className="empty-state flex flex-col items-center text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FiBook className="empty-icon text-4xl mb-2" />
              <p>Select a topic to start practicing!</p>
            </motion.div>
          ) : (
            <>
              {practiceData.map(renderQuestion)}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}