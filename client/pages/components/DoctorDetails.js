"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const NotificationCard_1 = __importDefault(require("../../components/cards/NotificationCard"));
const PatientCard_1 = __importDefault(require("../../components/cards/PatientCard"));
const ethers_1 = require("ethers");
const Healthcare_json_1 = __importDefault(require("../../utils/Healthcare.json"));
// import { 
//   getDoctorByWalletAddress, 
//   getHospitalByWalletAddress, 
//   getBookingByDoctorId 
// } from '../../Api';
const index_1 = require("../../pages/api/index");
function DoctorDetails() {
    const [filename, setFilename] = (0, react_1.useState)('');
    const [myPatients, setMyPatients] = (0, react_1.useState)([]);
    const inputRef = (0, react_1.useRef)(null);
    const [doctorDetails, setDoctorDetails] = (0, react_1.useState)({
        name: '',
        description: '',
        image: ''
    });
    const [bookingDetails, setBookingDetails] = (0, react_1.useState)([]);
    const deployAddress = "0x2a2D6a534Fab584A10A1d09BAeCF81E0977bC124";
    let provider;
    let signer;
    if (typeof window !== 'undefined') {
        provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
    }
    const fetch = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const contract = new ethers_1.ethers.Contract(deployAddress, Healthcare_json_1.default.abi, signer);
            const hospitalAddress = yield contract.showMyHospital();
            const address = yield signer.getAddress();
            const hospitalResponse = yield (0, index_1.getHospitalByWalletAddress)(hospitalAddress);
            const id = hospitalResponse.data.data.hospital[0]._id;
            const doctorAbout = yield (0, index_1.getDoctorByWalletAddress)(id, address);
            const doctor = doctorAbout.data.data.doctor;
            const booking = yield (0, index_1.getBookingByDoctorId)(doctorAbout.data.data.doctor._id);
            const allMyPatient = yield contract.getAllMyAddedPatient();
            setMyPatients(allMyPatient);
            setDoctorDetails({ name: doctor.name, description: doctor.description, image: doctor.image });
            setBookingDetails(booking.data.data.booking);
            console.log("allMyPatient: ", allMyPatient);
        }
        catch (error) {
            console.log(error);
        }
    });
    const onFileChange = () => {
        setFilename(inputRef.current.files[0].name);
    };
    (0, react_1.useEffect)(() => {
        fetch();
    }, []);
    const styles = {
        main: `w-full flex flex-col items-center`,
        upper: `w-full h-screen flex justify-around items-center`,
        left_container: `w-5/12 h-5/6 flex flex-col justify-between items-start ml-20`,
        img_container: `border-2 w-6/12 h-4/6 drop-shadow-2.5xl ml-10`,
        txt_container: `w-11/12 h-1/6 flex flex-col justify-center items-start ml-10`,
        name_container: `w-5/12 h-10 bg-white border-2 drop-shadow-2xl flex justify-center items-center`,
        btn_container: `w-11/12 h-1/6`,
        btn_bg: `w-7/12 h-5/6 bg-white border-2 drop-shadow-2xl ml-10 p-1 active:drop-shadow-xl active:bg-ocen_blue p-2 overflow-auto`,
        right_container: `w-4/12 h-5/6 mr-20`,
        main_box: `bg-dark_pink w-full h-full drop-shadow-2.5xl border-2 flex flex-col justify-start items-between p-10 overflow-auto`,
        lower: `w-8/12 mb-20 mt-20`
    };
    return (<div className={styles.main}>
      <div className={styles.upper}>
        <div className={styles.left_container}>
          <div className={styles.img_container}>
            <img src={`${doctorDetails.image}`} alt="" className='w-full h-full' onClick={fetch}/>
          </div>
          <div className={styles.txt_container}>
          <div className={styles.name_container}>
            <span>{doctorDetails.name}</span>
          </div>
          </div>
          <div className={styles.btn_container}>
            <div className={styles.btn_bg}>
              <span>{doctorDetails.description}</span>
            </div>
          </div>
        </div>
        <div className={styles.right_container}>
          <div className={styles.main_box}>
            {bookingDetails.map((i) => {
            return (<NotificationCard_1.default key={i._id} bookingId={i._id} id={i.patientID} date={i.bookingDate} time={i.bookingTime}/>);
        })}
          </div>
        </div>
      </div>
      <div className={styles.lower}>
        {myPatients.map((i) => {
            return (<PatientCard_1.default key={i} walletAddress={i}/>);
        })}
      </div>
    </div>);
}
exports.default = DoctorDetails;
