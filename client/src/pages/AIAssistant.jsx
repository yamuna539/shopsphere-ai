import AIChat from "../components/AIChat";

import {
  FaRobot,
  FaMagic,
  FaShoppingBag,
  FaLightbulb,
  FaShieldAlt,
} from "react-icons/fa";


const AIAssistant = () => {
  return (
    <div className="shopsphere-ai-page">

      <div className="container">

        {/* =================================================
            AI HEADER
        ================================================= */}

        <div className="shopsphere-ai-header">

          <div className="shopsphere-ai-header-content">

            <div className="shopsphere-ai-icon">
              <FaRobot />
            </div>

            <div>

              <div className="shopsphere-ai-label">
                <FaMagic />
                AI POWERED SHOPPING
              </div>

              <h1>
                ShopSphere AI Assistant
              </h1>

              <p>
                Find the right products based on your
                needs, preferences, and budget.
              </p>

            </div>

          </div>


          <div className="shopsphere-ai-status">

            <span className="shopsphere-ai-status-dot"></span>

            AI Online

          </div>

        </div>


        {/* =================================================
            QUICK FEATURES
        ================================================= */}

        <div className="shopsphere-ai-features">

          <div className="shopsphere-ai-feature">

            <div className="shopsphere-ai-feature-icon">
              <FaShoppingBag />
            </div>

            <div>
              <strong>
                Smart Recommendations
              </strong>

              <span>
                Discover products for your needs
              </span>
            </div>

          </div>


          <div className="shopsphere-ai-feature">

            <div className="shopsphere-ai-feature-icon">
              <FaLightbulb />
            </div>

            <div>
              <strong>
                Personalized Help
              </strong>

              <span>
                Ask questions about products
              </span>
            </div>

          </div>


          <div className="shopsphere-ai-feature">

            <div className="shopsphere-ai-feature-icon">
              <FaShieldAlt />
            </div>

            <div>
              <strong>
                Shop With Confidence
              </strong>

              <span>
                Get helpful product information
              </span>
            </div>

          </div>

        </div>


        {/* =================================================
            AI CHAT
        ================================================= */}

        <div className="shopsphere-ai-chat-wrapper">

          <div className="shopsphere-ai-chat-header">

            <div className="shopsphere-ai-chat-title">

              <div className="shopsphere-ai-mini-icon">
                <FaRobot />
              </div>

              <div>

                <strong>
                  ShopSphere AI
                </strong>

                <span>
                  Your personal shopping assistant
                </span>

              </div>

            </div>


            <div className="shopsphere-ai-chat-online">

              <span></span>

              Online

            </div>

          </div>


          <div className="shopsphere-ai-chat-body">

            <AIChat />

          </div>

        </div>


        {/* =================================================
            BOTTOM NOTE
        ================================================= */}

        <div className="shopsphere-ai-bottom-note">

          <FaShieldAlt />

          <span>
            ShopSphere AI provides product suggestions
            from the products available in the store.
          </span>

        </div>

      </div>

    </div>
  );
};


export default AIAssistant;