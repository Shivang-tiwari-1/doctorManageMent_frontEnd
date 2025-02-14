//parent-->ExpertiesPageModel--->SchedulePageModel

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../Redux/Store/Store";
import Time from "../../Utility/Time.Utility";
import {
  toogleShow2,
  toogleShow3,
  toogleShow4,
} from "../../Redux/slices/Patient.Redux";
import {
  set_doc_isActive,
  setHoverField,
} from "../../Redux/slices/signup_login.";
import {
  filterCollectionDay,
  getDetailOfthePatient,
  setCriteria,
} from "../../Redux/slices/Doctor.Redux";
import Patients from "./DocHomeComponents/Patients";
import { socket } from "../../Constants";
import {
  listen_message,
  receivedmessage,
  sendDataSocket,
} from "../../Sockets/Initialize_socket";
import Cards from "../../Utility/PageModel/Cards";
import listners from "../../Sockets/listners";

const DocHome = () => {
  const dispatch = useAppDispatch();
  //*******************AppSelectors********************** */
  const { isDark } = useAppSelector((state) => state.stateChange);

  const { show2, show3, show4, searchQuery } = useAppSelector(
    (state) => state.patient
  );
  const {
    expertise,
    select,
    collectDay,
    drop,
    patientData,
    container,
    scrollLeft,
    childWidth,
    scroll,
    scrollx,
    IsInFocus,
    index,
  } = useAppSelector((state) => state.doctor);
  const { currentStep } = useAppSelector((state) => state.states);
  const {
    userData,
    hoveredField,
    proggresWidth,
    document,
    sendTime,
    startTime,
    endTime,
    value,
    day,
    date,
    qualificationExists,
    availabilityExists,
    specializationExists,
  } = useAppSelector((state) => state.states);

  //*******************AppSelectors********************** */
console.log(socket.id)
  //********************hooks***********************//
  useEffect(() => {
    if (socket.connected) {
      sendDataSocket(dispatch, socket, userData?.data);
      // receivedmessage(socket, dispatch);
    }
  }, [socket]);

  useEffect(() => {
    if (socket.connected) {
      listners("listen_to_message", dispatch);

    }
    return () => {
      socket.off("listen_to_message");
    };
  }, [socket]);

  useEffect(() => {
    dispatch(getDetailOfthePatient());
    dispatch(set_doc_isActive());
  }, [dispatch]);

  //********************hooks***********************//

  //********************handle function********************//
  const handleMouseOver = (fieldNam: string) => {
    dispatch(setHoverField(fieldNam));
  };

  const handleMouseOut = () => {
    dispatch(setHoverField(""));
  };

  const handleToggleShow2 = () => {
    dispatch(toogleShow2());
  };

  const handleToggleShow3 = () => {
    dispatch(toogleShow3());
  };

  const handleToggleShow4 = () => {
    dispatch(toogleShow4());
  };

  const submitAvailability = () => {
    if ((collectDay ?? []).length > 6) {
      dispatch((dispatch, getState) => {
        dispatch(filterCollectionDay(collectDay));
        const updatedState = getState().doctor.collectDay;
        dispatch(setCriteria(updatedState));
      });
    } else {
      console.log("error");
    }
  };
  //********************handle function********************//

  return (
    <div
      className={`${isDark ? "bg-black" : "bg-white"
        } flex justify-center items-center w-full h-auto`}
    >
      <div className="flex flex-col h-auto items-center  mobile:w-full desktop:w-[100%] laptop:w-[100%] tablet:w-[100%]">
        {/* //first-element div child-start*/}
        <div className="flex justify-center items-center tablet:w-full desktop:w-[100%] h-[85vh]  bg-gradient-to-r from-blue-200 to-blue-400 rounded-bl-full rounded-br-full flex-col text-white ">
          <p className="font-[500]  text-6xl ">{`hello Dr\`${userData?.data?.name}`}</p>
          <div className=" border-b-2  tablet:w-[40%] laptop:w-[15%] desktop:w-[20%] mobile:w-[10%] h-[0.6px] rounded-md py-2"></div>
          <div className="flex gap-3">
            <p className="font-[500] text-3xl ">{date}</p>
            <p className=" font-[500] text-3xl">{day}</p>
          </div>
          {!value && document !== undefined ? (
            <div
              className={`flex  flex-col justify-center items-center py-5 ${userData?.data?.availability.length === 0 ? "hidden" : ""
                }`}
            >
              <p className="text-2xl font-[500]">Next session in</p>
              <div>{startTime ? <Time startTime={startTime} /> : ""}</div>
            </div>
          ) : (
            startTime &&
            endTime && (
              <div className="flex justify-center items-center py-5 flex-col">
                <p className="text-2xl font-[500]">Toaday`s session</p>
                <div className="flex items-center gap-[1rem] py-4">
                  <p className="font-[500] text-5xl">{startTime}</p>
                  <span className="font-[500] ">To</span>
                  <p className="font-[500] text-5xl">{endTime}</p>
                </div>
              </div>
            )
          )}

          <div className={`py-3  ${value ? "" : "hidden"}`}>
            {endTime ? <Time startTime={endTime} /> : ""}
          </div>
        </div>
        {/* //first-element div child-end*/}

        {/* //second-element div child-start*/}
        {userData?.data.qualification?.length === 0 ||
          userData?.data?.specialization?.length === 0 ||
          userData?.data?.availability.length === 0 ? (
          <div className={`flex flex-col tablet:w-full desktop:w-[70%] h-auto`}>
            <div
              className={`flex flex-col justify-center items-center ${isDark ? "text-white" : ""
                } `}
            >
              <p
                className={` flex justify-center items-center py-4 text-4xl font-[500] tablet:w-[60vh] desktop:w-[70vh]`}
              >
                With few steps you`ll be up and
              </p>
              <p className="flex justify-center items-center py-0 text-4xl font-[500] tablet:w-[60vh] desktop:w-[70vh]">
                ready to take patient`s
              </p>
            </div>

            <div
              className={`flex justify-center items-center py-6 ${currentStep === 4 ? "hidden" : ""
                }`}
            >
              <div className="w-[80%] ">
                <div className="relative border-2  rounded-md flex  items-center h-4  justify-between ">
                  <div
                    className="absolute left-0 h-full bg-blue-400 rounded-md "
                    style={{ width: `${proggresWidth}%`, height: "8px" }}
                  ></div>
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className="border-2  h-[30px]  rounded-full w-9 shadow-2xl bg-blue-400 z-50"
                    >
                      <p className="flex justify-center font-[500]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex desktop:justify-center tablet:justify-evenly items-center h-[45vh] desktop:gap-[4rem]">
              <Cards
                show2={show2}
                show3={show3}
                show4={show4}
                handleToggleShow2={handleToggleShow2}
                handleToggleShow3={handleToggleShow3}
                handleToggleShow4={handleToggleShow4}
                isDark={isDark}
                userData={userData.data}
                expertise={expertise}
                searchQuery={searchQuery}
                select={select}
                date={date}
                day={day}
                collectDay={collectDay}
                drop={drop}
                submitAvailability={submitAvailability}
                qualificationExists={qualificationExists}
                availabilityExists={availabilityExists}
                specializationExists={specializationExists}
              />
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col tablet:w-full desktop:w-[70%] h-auto mt-6 ${isDark ? "text-white" : ""
              }`}
          >
            <Patients
              isDark={isDark}
              patientData={patientData}
              container={container}
              scrollLeft={scrollLeft}
              childWidth={childWidth}
              scroll={scroll}
              scrollx={scrollx}
              IsInFocus={IsInFocus}
              index={index}
            />
          </div>
        )}
        {/* //second-element div child- end*/}
      </div>
    </div>
  );
};

export default DocHome;
