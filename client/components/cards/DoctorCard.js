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
const sweetalert2_1 = __importDefault(require("sweetalert2"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
// import { createBooking } from '../../Api';
const index_1 = require("../../pages/api/index");
const ethers_1 = require("ethers");
const Healthcare_json_1 = __importDefault(require("../../utils/Healthcare.json"));
const getStaticProps = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        revalidate: 5,
        props: {
            id: '',
            name: '',
            image: '',
            description: '',
            specialistAt: '',
            day: '',
            time: ''
        }
    };
});
exports.getStaticProps = getStaticProps;
function DoctorCard(props) {
    const [booked, setBooked] = (0, react_1.useState)(false);
    const [bookingDetails, setBookingDetails] = (0, react_1.useState)({
        doctorId: '',
        patientId: '',
        patientAddress: '',
        date: '',
        time: ''
    });
    const deployAddress = "0x2a2D6a534Fab584A10A1d09BAeCF81E0977bC124";
    let provider;
    let signer;
    if (typeof window !== 'undefined') {
        provider = new ethers_1.ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
    }
    const handleBooking = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const token = JSON.parse(localStorage.getItem("Token") || '{}').value;
            let decodedToken = {};
            decodedToken = (0, jwt_decode_1.default)(token);
            sweetalert2_1.default.fire({
                title: 'Booking Form',
                html: `<input type="date" id="date" class="swal2-input" placeholder="date">
        <input type="time" id="time" class="swal2-input" placeholder="time">`,
                confirmButtonText: 'Book now',
                focusConfirm: false,
                preConfirm: () => {
                    var _a, _b, _c, _d;
                    const date = (_b = (_a = sweetalert2_1.default.getPopup()) === null || _a === void 0 ? void 0 : _a.querySelector('#date')) === null || _b === void 0 ? void 0 : _b.value;
                    const time = (_d = (_c = sweetalert2_1.default.getPopup()) === null || _c === void 0 ? void 0 : _c.querySelector('#time')) === null || _d === void 0 ? void 0 : _d.value;
                    if (!date || !time) {
                        sweetalert2_1.default.showValidationMessage(`Please enter date and time`);
                    }
                    return { date: date, time: time };
                }
            }).then((result) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                console.log("Clicked");
                setBookingDetails({
                    doctorId: props.id,
                    patientId: decodedToken.id,
                    patientAddress: yield signer.getAddress(),
                    date: (_a = result.value) === null || _a === void 0 ? void 0 : _a.date,
                    time: (_b = result.value) === null || _b === void 0 ? void 0 : _b.time
                });
                sweetalert2_1.default.fire(`
          Time: ${(_c = result.value) === null || _c === void 0 ? void 0 : _c.date}
          Date: ${(_d = result.value) === null || _d === void 0 ? void 0 : _d.time}
        `.trim());
            }));
            setBooked(prev => !prev);
        }
        catch (err) {
            console.log(err);
        }
    });
    const book = () => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("booking Details: ", bookingDetails);
            const response = yield (0, index_1.createBooking)({
                doctorID: bookingDetails.doctorId,
                patientID: bookingDetails.patientId,
                patientAddress: bookingDetails.patientAddress,
                bookingTime: bookingDetails.time,
                bookingDate: bookingDetails.date
            });
            console.log(response);
            setBooked(prev => !prev);
            sweetalert2_1.default.fire({
                position: 'top-end',
                icon: 'success',
                title: 'You Successfully book your slot',
                showConfirmButton: false,
                timer: 1500
            });
        }
        catch (error) {
            console.log(error);
        }
    });
    const show = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const contract = new ethers_1.ethers.Contract(deployAddress, Healthcare_json_1.default.abi, signer);
            const response = yield contract.showMyReports();
            console.log(response);
            sweetalert2_1.default.fire({
                title: 'All Reports',
                html: '<ul>' +
                    response.map((report) => `<li>
              <span class='text-2xl text-semibold text-black'>
                ${report.name}:
              </span> 
              <a href=${report.prescription} target=”_blank” class='text-ocen_blue'>
                ${report.prescription}
              </a>
            </li>`).join('') +
                    '</ul>',
                confirmButtonText: 'OK'
            });
        }
        catch (error) {
            console.log(error);
        }
    });
    const styles = {
        doc_container: `border-2 w-full mt-10 h-32 flex justify-between items-center bg-white drop-shadow-2.5xl`,
        sm_img_container: `border-2 h-full w-32 ml-10 rounded-full`,
        doc_detail_container: `h-full w-6/12 flex flex-col justify-center items-start`,
        btn_container: `h-full w-3/12 flex flex-col justify-around items-center`,
        yellow_btn: `w-6/12 h-10 bg-grinish-yellow border-2 drop-shadow-2xl active:mt-1 active:drop-shadow-xl`,
        green_btn: `w-6/12 h-10 bg-deep_green border-2 drop-shadow-2xl active:mt-1 active:drop-shadow-xl`,
        blue_btn: `w-6/12 h-10 bg-ocen_blue border-2 drop-shadow-2xl active:mt-1 active:drop-shadow-xl`,
        semibold_txt: `font-semibold text-lg`,
        popup_box: `border-2 w-96 h-96 bg-ocen_blue absolute z-10 left-40 right-0 bottom-0 `
    };
    return (<div>
      <div className={styles.doc_container}>
          <div className={styles.sm_img_container}>
            <img src={`${props.image}`} alt="" className='w-full h-full rounded-full'/>
          </div>
          <div className={styles.doc_detail_container}>
            <span className={styles.semibold_txt}>{props.name}</span>
            <span>{props.description}</span>
            <span>{props.specialistAt}</span>
            <span>{props.day} {props.time}</span>
          </div>
          <div className={styles.btn_container}>
            {!booked ?
            <button className={styles.yellow_btn} onClick={handleBooking}>
                <span className='text-xl'>{"Book Now"}</span>
              </button>
            :
                <button className={styles.green_btn} onClick={book}>
                <span className='text-xl'>{"Book"}</span>
              </button>}
            <button className={styles.blue_btn} onClick={show}>
              <span className='text-xl'>Show report</span>
            </button>
          </div>
        </div>
    </div>);
}
exports.default = DoctorCard;
