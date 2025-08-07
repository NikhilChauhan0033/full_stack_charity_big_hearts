import { useState, useEffect } from "react";
import Button from "../buttoncomponent/Button";
import { useNavigate } from "react-router-dom";

const Mission_Vision_Values = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("access"));

  const [missionStats, setMissionStats] = useState({
    percent: 0,
    raised: 0,
    volunteers: 0,
  });

  const [visionProgress, setVisionProgress] = useState({ one: 0, two: 0 });

  // Animate stats when MISSION tab is active
  useEffect(() => {
    if (activeTab === 0) {
      let percent = 0;
      let raised = 0;
      let volunteers = 0;

      const interval = setInterval(() => {
        percent = Math.min(percent + 1, 25);
        raised = Math.min(raised + 500, 150000);
        volunteers = Math.min(volunteers + 1500, 75000);

        setMissionStats({
          percent,
          raised,
          volunteers,
        });

        if (percent === 25 && raised === 150000 && volunteers === 75000)
          clearInterval(interval);
      }, 30);

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Animate progress when VISION tab is active
  useEffect(() => {
    if (activeTab === 1) {
      let one = 0;
      let two = 0;
      const interval = setInterval(() => {
        one = Math.min(one + 1, 60);
        two = Math.min(two + 1, 80);
        setVisionProgress({ one, two });
        if (one === 60 && two === 80) clearInterval(interval);
      }, 20);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleDonate = () => {
    if (!token) {
      alert("Please login to donate.");
      navigate("/login");
    } else {
      navigate("/donations");
    }
  };

  return (
    <>
      {/* Tab Buttons - Mobile only: 2 above, 1 below | Tablet & Desktop: all in row */}
      <div className="mt-10">
        {/* Mobile Only Layout (below sm) */}
        <div className="flex flex-col sm:hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab(0)}
              className="py-5 px-6 rounded-t-xl tracking-widest text-white text-base w-fit"
              style={{
                backgroundColor: "#FD853E",
                fontFamily: '"Amatic SC", cursive',
              }}
            >
              MISSION
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className="py-5 px-6 rounded-t-xl tracking-widest text-white text-base w-fit"
              style={{
                backgroundColor: "#F67123",
                fontFamily: '"Amatic SC", cursive',
              }}
            >
              VISION
            </button>
          </div>
          <div className="flex">
            <button
              onClick={() => setActiveTab(2)}
              className="py-5 px-6 rounded-t-xl tracking-widest text-white text-base w-fit"
              style={{
                backgroundColor: "#DD5E12",
                fontFamily: '"Amatic SC", cursive',
              }}
            >
              VALUES
            </button>
          </div>
        </div>

        {/* Tablet & Desktop Layout (sm and above) */}
        <div className="hidden sm:flex sm:flex-row xl:flex-row xl:items-start xl:gap-0">
          <div className="flex">
            <button
              onClick={() => setActiveTab(0)}
              className="py-4 px-6 rounded-t-xl tracking-widest text-white text-[18px] w-[fit-content]"
              style={{
                backgroundColor: "#FD853E",
                fontFamily: '"Amatic SC", cursive',
              }}
            >
              MISSION
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className="py-4 px-6 rounded-t-xl tracking-widest text-white text-[18px] w-[fit-content]"
              style={{
                backgroundColor: "#F67123",
                fontFamily: '"Amatic SC", cursive',
              }}
            >
              VISION
            </button>
          </div>
          <button
            onClick={() => setActiveTab(2)}
            className="py-4 px-6 rounded-t-xl tracking-widest text-white text-[18px] w-[fit-content]"
            style={{
              backgroundColor: "#DD5E12",
              fontFamily: '"Amatic SC", cursive',
            }}
          >
            VALUES
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col xl:flex-row justify-between xl:h-[90vh]">
        {/* Left Side */}
        <div
          className="w-full xl:w-1/2 h-full p-6 sm:p-8 xl:p-20 text-white flex flex-col justify-center overflow-hidden"
          style={{
            backgroundColor:
              activeTab === 0
                ? "#FD853E"
                : activeTab === 1
                ? "#F67123"
                : "#DD5E12",
          }}
        >
          {/* MISSION CONTENT */}
          {activeTab === 0 && (
            <div className="w-full max-w-none">
              <p
                style={{ fontFamily: '"Amatic SC", cursive' }}
                className="uppercase tracking-widest text-base sm:text-lg font-semibold mb-2"
              >
                Always Open
              </p>
              <h2 className="text-2xl sm:text-3xl xl:text-4xl font-bold mb-4 leading-tight">
                Listen, Act, Learn. Repeat
              </h2>
              <p className="text-white text-sm sm:text-base xl:text-lg leading-relaxed mb-6 xl:mb-10">
                BigHearts is the largest global crowdfunding community
                connecting nonprofits, donors, and companies in nearly every
                country. We help nonprofits from Afghanistan to Zimbabwe (and
                hundreds of places in between) access.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 xl:gap-10 mb-6 xl:mb-10 text-center">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl xl:text-3xl font-bold">
                    {missionStats.percent}%
                  </h3>
                  <p className="text-xs sm:text-sm xl:text-base">
                    KIDS NEED HELP
                  </p>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl xl:text-3xl font-bold">
                    ${Math.floor(missionStats.raised / 1000)}k
                  </h3>
                  <p className="text-xs sm:text-sm xl:text-base">RAISED NOW</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl xl:text-3xl font-bold">
                    {Math.floor(missionStats.volunteers / 1000)}k+
                  </h3>
                  <p className="text-xs sm:text-sm xl:text-base">VOLUNTEERS</p>
                </div>
              </div>
              <Button
                onClick={handleDonate}
                className="bg-[#E3491D] text-white font-semibold py-3 px-6 xl:py-4 xl:px-8 rounded-full hover:bg-white hover:text-black text-sm xl:text-base w-full sm:w-auto"
                text="DONATE NOW"
                icon={null}
              />
            </div>
          )}

          {/* VISION CONTENT */}
          {activeTab === 1 && (
            <div className="w-full max-w-none">
              <p
                style={{ fontFamily: '"Amatic SC", cursive' }}
                className="uppercase tracking-widest text-base sm:text-lg font-semibold mb-2"
              >
                HOW WE HELP
              </p>
              <h2 className="text-2xl sm:text-3xl xl:text-4xl font-bold mb-4 leading-tight">
                Give Education for Children
              </h2>
              <p className="text-white text-sm sm:text-base xl:text-lg leading-relaxed mb-6">
                Elementum sagittis vitae et leo duis ut diam quam nulla. Sodales
                ut etiam sit amet nisl purus in mollis nunc.
              </p>

              <div className="mb-6">
                <p className="font-bold mb-1 text-sm xl:text-base">
                  COMPLETED PROGRAM
                </p>
                <div className="w-full bg-white/40 h-2 rounded-full relative">
                  <div
                    className="bg-white h-2 rounded-full absolute top-0 left-0"
                    style={{ width: `${visionProgress.one}%` }}
                  ></div>
                </div>
                <p className="text-right mt-1 font-bold text-sm xl:text-base">
                  {visionProgress.one}%
                </p>
              </div>

              <div className="mb-6 xl:mb-10">
                <p className="font-bold mb-1 text-sm xl:text-base">
                  PROGRAM FOR THIS MONTH
                </p>
                <div className="w-full bg-white/40 h-2 rounded-full relative">
                  <div
                    className="bg-white h-2 rounded-full absolute top-0 left-0"
                    style={{ width: `${visionProgress.two}%` }}
                  ></div>
                </div>
                <p className="text-right mt-1 font-bold text-sm xl:text-base">
                  {visionProgress.two}%
                </p>
              </div>
              <Button
                onClick={handleDonate}
                className="bg-white text-black font-semibold py-3 px-6 xl:py-4 xl:px-8 rounded-full hover:bg-transparent hover:text-white border-2 border-white text-sm xl:text-base w-full sm:w-auto"
                text="DONATE NOW"
                icon={null}
              />
            </div>
          )}

          {/* VALUES CONTENT */}
          {activeTab === 2 && (
            <div className="w-full max-w-none">
              <p
                style={{ fontFamily: '"Amatic SC", cursive' }}
                className="uppercase tracking-widest text-base sm:text-lg font-semibold mb-2"
              >
                SAFE + EASY DONATIONS
              </p>
              <h2 className="text-2xl sm:text-3xl xl:text-4xl font-bold mb-4 leading-tight">
                Work in More Than 5k Countries
              </h2>
              <p className="text-white text-sm sm:text-base xl:text-lg leading-relaxed mb-6">
                We help donors make safe and easy US tax-deductible donations to
                vetted, locally-driven organizations around the world. Donations
                are tax-deductible, taxpayers can give in GBP and claim an extra
                25% if Gift Aid eligible.
              </p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-white/40 h-2 rounded-full relative">
                  <div className="bg-white h-2 rounded-full absolute top-0 left-0 w-[94%]"></div>
                </div>
                <p className="text-right mt-1 font-bold text-sm xl:text-base">
                  94%
                </p>
              </div>

              {/* Stats Below Progress */}
              <div className="flex justify-between mb-6 xl:mb-10 text-xs sm:text-sm xl:text-base">
                <div>
                  <p className="font-semibold">Goal:</p>
                  <p>$55,000</p>
                </div>
                <div className="border-l border-white h-full px-2 sm:px-4">
                  <p className="font-semibold">Raised:</p>
                  <p>$52,245</p>
                </div>
                <div className="border-l border-white h-full pl-2 sm:pl-4">
                  <p className="font-semibold">To Go:</p>
                  <p>$2,755</p>
                </div>
              </div>
              <Button
                onClick={handleDonate}
                className="bg-white text-black font-semibold py-3 px-6 xl:py-4 xl:px-8 rounded-full hover:bg-transparent hover:text-white border-2 border-white text-sm xl:text-base w-full sm:w-auto"
                text="DONATE NOW"
                icon={null}
              />
            </div>
          )}
        </div>

        {/* Right Side Image */}
        <div className="w-full xl:w-1/2 relative h-[300px] xl:h-auto">
          <img
            src="../../../src/assets/images/home-1_02.jpg"
            alt="Charity work"
            className="w-full h-full object-cover"
          />
          <img
            src="../../../src/assets/images/home-1_03.png"
            alt="Overlay"
            className="absolute bottom-0 opacity-80"
          />
        </div>
      </div>
    </>
  );
};

export default Mission_Vision_Values;
