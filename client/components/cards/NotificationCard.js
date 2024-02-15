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
exports.getStaticProps = void 0;
const react_1 = __importStar(require("react"));
const index_1 = require("../../pages/api/index");
const ethers_1 = require("ethers");
const Healthcare_json_1 = __importDefault(require("../../utils/Healthcare.json"));
const pinata_1 = require("../../Api/pinata");
const sweetalert2_1 = __importDefault(require("sweetalert2"));
const getStaticProps = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        revalidate: 5,
        props: {
            id: '',
            bookingId: '',
            time: '',
            date: ''
        }
    };
});
exports.getStaticProps = getStaticProps;
function NotificationCard(props) {
    const [addClick, setAddClick] = (0, react_1.useState)(false);
    const [patientDetails, setPatientDetails] = (0, react_1.useState)({
        name: '',
        email: '',
        age: '',
        gender: '',
        walletAddress: ''
    });
    const deployAddress = "0x2a2D6a534Fab584A10A1d09BAeCF81E0977bC124";
    let provider;
    let signer;
    if (typeof window !== 'undefined') {
        provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
    }
    const fetch = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, index_1.getSinglePatient)(props.id);
            const patient = response.data.data.patient[0];
            console.log(patient);
            setPatientDetails({
                name: patient.name,
                email: patient.email,
                age: patient.age,
                gender: patient.gender,
                walletAddress: patient.walletAddress
            });
            console.log(props.id);
        }
        catch (error) {
            console.log(error);
        }
    });
    const uploadMetadataToIPFS = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, pinata_1.uploadJSONToIPFS)({
                name: patientDetails.name,
                email: patientDetails.email,
                age: patientDetails.age,
                gender: patientDetails.gender,
                id: props.id,
                walletAddress: patientDetails.walletAddress
            });
            if (response.success === true) {
                return response.pinataURL;
            }
        }
        catch (error) {
            console.log("Upload metadata to IPFS error: ", error);
        }
    });
    const addPatient = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setAddClick(prev => !prev);
            const contract = new ethers_1.ethers.Contract(deployAddress, Healthcare_json_1.default.abi, signer);
            const patientJSON = yield uploadMetadataToIPFS();
            const deleteBook = yield (0, index_1.deleteBooking)(props.bookingId);
            const add = yield contract.addPatient(patientDetails, patientDetails.walletAddress);
            sweetalert2_1.default.fire({
                position: 'top-end',
                icon: 'success',
                title: 'You Successfully add your Patient',
                showConfirmButton: false,
                timer: 1500
            });
            window.location.replace("/components/AddHospital");
            console.log("id: ", props.bookingId);
            console.log("address: ", patientDetails.walletAddress);
        }
        catch (error) {
            console.log(error);
        }
    });
    (0, react_1.useEffect)(() => {
        fetch();
    }, []);
    const styles = {
        card_container: `border-2 w-11/12 h-36 bg-white mb-10 drop-shadow-2xl flex justify-between`,
        left_container: `w-7/12 h-full flex flex-col p-2`,
        right_container: `w-3/12 h-full flex justify-center items-center`,
        btn: `bg-light-sky p-2 border-2 w-11/12 h-10 drop-shadow-2xl mr-5 active:mt-5 active:drop-shadow-xl`
    };
    return (<div>
      <div className={styles.card_container}>
        <div className={styles.left_container}>
          <span>{patientDetails.name}</span>
          <span>{patientDetails.email}</span>
          <div className='flex w-7/12 justify-between'>
            <span>age: {patientDetails.age}</span>
            <span>{patientDetails.gender}</span>
          </div>
          <span className='font-semibold text-sm'>Booking Time: {props.time}</span>
          <span className='font-semibold text-sm'>Booking Date: {props.date}</span>
        </div>
        <div className={styles.right_container}>
          <button className={styles.btn} onClick={addPatient}>{addClick ? "Adding..." : "Add +"}</button>
        </div>
      </div>
    </div>);
}
exports.default = NotificationCard;
