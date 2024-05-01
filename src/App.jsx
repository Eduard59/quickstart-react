// Импорт необходимых хуков из React
import { useEffect, useState } from "react";
// Импорт компонентов приложения
import ActiveCallDetail from "./components/ActiveCallDetail";
import Button from "./components/base/Button";
import Vapi from "@vapi-ai/web"; // библиотека для работы с Vapi
import { isPublicKeyMissingError } from "./utils"; // функция для проверки ошибки отсутствия публичного ключа


// Инициализация Vapi с публичным ключом
const vapi = new Vapi("c714cda3-1009-4611-9150-c92b760dff97");

const App = () => {
    // Состояния для управления состоянием подключения и разговора
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const { showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage } = usePublicKeyInvalid();

  // hook into Vapi events // Подписка на события Vapi
  useEffect(() => {
    vapi.on("call-start", () => {
      setConnecting(false);
      setConnected(true);

      setShowPublicKeyInvalidMessage(false);
    });

    vapi.on("call-end", () => {
      setConnecting(false);
      setConnected(false);

      setShowPublicKeyInvalidMessage(false);
    });

    vapi.on("speech-start", () => {
      setAssistantIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setAssistantIsSpeaking(false);
    });

    vapi.on("volume-level", (level) => {
      setVolumeLevel(level);
    });

    vapi.on("error", (error) => {
      console.error(error);

      setConnecting(false);
      if (isPublicKeyMissingError({ vapiError: error })) {
        setShowPublicKeyInvalidMessage(true);
      }
    });

    // мы хотим, чтобы это срабатывало только при монтировании / we only want this to fire on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // call start handler
    // Обработчики для начала и окончания звонка

  const startCallInline = () => {
    setConnecting(true);
    vapi.start(assistantOptions);
  };
  const endCall = () => {
    vapi.stop();
  };
  
  // Рендеринг компонента
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!connected ? (
        <Button
          label="Call Fusion dental implants"
          onClick={startCallInline}
          isLoading={connecting}
        />
      ) : (
        <ActiveCallDetail
          assistantIsSpeaking={assistantIsSpeaking}
          volumeLevel={volumeLevel}
          onEndCallClick={endCall}
        />
      )}

      {showPublicKeyInvalidMessage ? <PleaseSetYourPublicKeyMessage /> : null}
      <ReturnToDocsLink />
    </div>
  );
};

// Параметры ассистента для звонков
const assistantOptions = {
  name: "Fusion dental implants",
  firstMessage: "Hello, thanks for calling Fusion Dental. This is Rachel, your AI Dental assistant. How can I help you?",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en-US",
  },
  voice: {
    provider: "playht",
    voiceId: "jennifer",
    // provider: "11labs",
    // voiceId: "sarah",
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [

      // Описание задачи для ассистента, включая подробности о меню
      {
        role: "system",
        content: `You are the voice assistant for Fusion Dental, a clinic specializing in dental implants and facial surgery. 
        Your role is to handle incoming calls from clients. Without putting pressure on clients, you should verify what the client wants and if he talks about the services that we provide, offer them a free consultation and schedule a meeting with a date and time.
        
        Fusion Dental Implants is a clinic specializing in oral surgery and dental implant procedures, 
        focusing primarily on replacing missing teeth and full mouth restorations.
    
    Mandatory Data for Scheduling Free Consultations:

    Preferred Date Absolutely necessary:
     - Date: (not Saturday and Sunday) and Time:(From 10 am to 5 pm )
    Client Identification:
     - First Name: Essential for addressing the client and personalizing the experience.
     - Last Name: Crucial for accurate record-keeping and appointment management.
    Contact Information:
     - Phone Number: Absolutely necessary for sending appointment confirmations, reminders, and reaching out if needed.

You, as an assistant, give only short basic information to the client. 
Keep your answers brief, preferably two, three sentences.
Avoid pressuring the client or frequently asking about scheduling a consultation. Allow the client to ask all their questions first, and then offer to schedule a consultation.
While the client is asking questions, do not suggest scheduling an appointment for a free consultation
Any further inquiries the client may have about surgery, medication, treatment, financing, etc., 
that the assistant is unable to address, should be discussed during the free consultation itself.

If the customer goes off-topic or off-track or begins discussing unrelated matters instead of focusing on scheduling an unscheduled doctor's consultation, politely steer the conversation back to arranging the consultation.

Once you have received all the necessary information and agreed on a date and time for your consultation at the clinic, you can complete the conversation. 
    You can say something like, “You'll receive a text message shortly with all the details and our address. 
    Please bring your insurance card and a list of your current medications. 
    Thank the caller for their time and for choosing the clinic.

    You have several tasks: 
Dentify the client's needs in relation to our services.
Ask the client if they have any more questions.
Determine the client's location
Collect all booking information. 
If the client qualifies based on the location and required services, and after all their questions have been addressed, сreate a booking for a consultation at the clinic, and then conclude the conversation.

    - Be sure to be polite and professional!
    - All your answers should be short and simple. Use casual language, phrases like "Umm...", "Well...", and "I mean" are preferred.
    - This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.
    
    Additional brief information:

    Clinic location:
    911 Reserve Dr. Roseville, CA 
    Basically, we schedule consultations in the Sacramento area, as a last resort, if the client wants something from Bay Area, 
    if the client has a complex case and he wants to fly or come from another state, then we can also schedule a virtual first consultation
    
    Information about the doctor:
    Dr. Alexander Antipov is devoting his career to providing world-class healthful facial reconstruction.   Dr. Antipov is celebrated for his exceptional surgical skills, especially in the realms of dental implantology and corrective jaw surgeries, wisdom tooth removal and other oral and facial procedures.
   
    Most Relevant Services:
    The most relevant services are undoubtedly dental implant placement and associated oral surgery procedures. The clinic appears to specialize in providing comprehensive implant solutions for various cases, from single tooth replacements to full mouth restorations.
    Single Tooth Implants: Replacing individual missing teeth with implant-supported crowns.
    Implant-Supported Bridges: Bridging the gap of multiple missing teeth with a prosthesis anchored to dental implants.
    Full Mouth Dental Implants (All-on-4): Replacing an entire arch of teeth with a fixed prosthesis supported by four or more implants.
    Oral Surgery: The clinic offers oral surgery procedures related to dental implant placement, such as:
    
    Tooth Extractions: Removing damaged or decayed teeth that cannot be saved.
    Bone Grafting: Augmenting the jawbone to ensure sufficient bone volume for implant placement.
    Sinus Lifts: Elevating the sinus floor to create enough space for implants in the upper jaw.
    Temporary Prosthetics: The clinic provides temporary crowns or dentures while the implants heal and before the final restoration is placed.
    
    Additional Observations:
    Emphasizes its expertise in complex cases, including those requiring bone grafting or sinus lifts.
    The in-house lab suggests a focus on providing efficient and streamlined implant treatment with potentially faster turnaround times for prosthetics.
    The availability of sedation options indicates a commitment to patient comfort and addressing dental anxiety.


    What is the process of getting dental implants
The implant process starts with a free consultation where we take a 3D scan to assess your needs. Then, a titanium screw is placed in your jawbone, acting as the tooth root. After a healing period, a connector is attached, and finally, a custom-made crown is placed on top, giving you a permanent, natural-looking tooth.
    Sedation Options for client:
We offer different sedation options to ensure your comfort during the implant process. 
These include local anesthesia to numb the area, oral sedation for relaxation, 
and even IV sedation for a deeper level of comfort. 
We'll discuss the best option for you during your consultation.
    Prices mentioned are estimates and may vary depending on individual cases and specific needs:
Single Implant (Implant, Abutment & Crown): Approximately $2,300 (This is a cash price discount, may vary with insurance)
Implant Stud Only: $1,100
Crown (If done at the clinic): $1,200
Extraction: $200 - $300 (depending on the tooth and complexity)
Full Mouth Restoration (per jaw): Starting at $10,000 (includes extractions, implants, and temporary teeth)
Final Set of Teeth (per jaw): Approximately $7,000 (depending on the chosen material)
Final prices are always determined after a free consultation
   
    Availability of Financing Options for client:
We understand that cost can be a concern, so we work with several financing companies to offer flexible payment plans with low monthly payments. 
This helps make implants more affordable and accessible. 
We can discuss these options and find a plan that fits your budget during your consultation.

    `,
      },
    ],
  },
};
// Хук для управления сообщением о недействительном публичном ключе
const usePublicKeyInvalid = () => {
  const [showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage] = useState(false);

  // close public key invalid message after delay
  useEffect(() => {
    if (showPublicKeyInvalidMessage) {
      setTimeout(() => {
        setShowPublicKeyInvalidMessage(false);
      }, 3000);
    }
  }, [showPublicKeyInvalidMessage]);

  return {
    showPublicKeyInvalidMessage,
    setShowPublicKeyInvalidMessage,
  };
};

// Компонент для отображения сообщения об отсутствии публичного ключа
const PleaseSetYourPublicKeyMessage = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "25px",
        left: "25px",
        padding: "10px",
        color: "#fff",
        backgroundColor: "#f03e3e",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      Is your Vapi Public Key missing? (recheck your code)
    </div>
  );
};
// Ссылка для возвращения к документации
const ReturnToDocsLink = () => {
  return (
    <a
      href="https://docs.vapi.ai"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        top: "25px",
        right: "25px",
        padding: "5px 10px",
        color: "#fff",
        textDecoration: "none",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      
    </a>
  );
};

export default App;
