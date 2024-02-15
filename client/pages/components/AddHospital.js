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
const link_1 = __importDefault(require("next/link"));
const react_type_animation_1 = require("react-type-animation");
const ethers_1 = require("ethers");
// import { createHospital, getHospitalByWalletAddress } from '../../Api';
const index_1 = require("../api/index");
const sweetalert2_1 = __importDefault(require("sweetalert2"));
const pinata_1 = require("../../Api/pinata");
const Healthcare_json_1 = __importDefault(require("../../utils/Healthcare.json"));
function AddHospital() {
    const [filename, setFilename] = (0, react_1.useState)('');
    const [uploaded, setUploaded] = (0, react_1.useState)(false);
    const inputRef = (0, react_1.useRef)(null);
    const [connected, setConnected] = (0, react_1.useState)(false);
    const [hospitalDetails, setHospitalDetails] = (0, react_1.useState)({
        name: '',
        walletAddress: '',
        email: '',
        description: '',
        image: '',
        location: '',
        phone: ['']
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
            const address = yield signer.getAddress();
            const response = yield (0, index_1.getHospitalByWalletAddress)(address);
            if (response.data.data.hospital.length !== 0) {
                window.location.replace(`/components/Hospital/${address}`);
            }
            console.log(response);
            console.log(address);
        }
        catch (error) {
            console.log(error);
        }
    });
    const uploadFile = (e) => __awaiter(this, void 0, void 0, function* () {
        let file = e.target.files[0];
        try {
            const response = yield (0, pinata_1.uploadFileToIPFS)(file);
            if (response.success === true) {
                setHospitalDetails(Object.assign(Object.assign({}, hospitalDetails), { image: `${response.pinataURL}` }));
                // console.log(response.pinataURL)
                setUploaded(true);
                const data1 = (response.pinataURL).slice(34, 41);
                const data2 = (response.pinataURL).slice(65, (response.pinataURL).length);
                setFilename(`${data1}.....${data2}`);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    const handleConnect = () => __awaiter(this, void 0, void 0, function* () {
        try {
            if (typeof window !== 'undefined') {
                const chainId = yield window.ethereum.request({ method: 'eth_chainId' });
                if (chainId != '0x13881') {
                    yield window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x13881' }],
                    });
                }
                yield window.ethereum.request({ method: 'eth_requestAccounts' });
                setConnected(true);
                setHospitalDetails(Object.assign(Object.assign({}, hospitalDetails), { walletAddress: yield signer.getAddress() }));
            }
        }
        catch (err) {
            console.log(err);
        }
    });
    // const 
    const handleSubmit = () => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(hospitalDetails);
            const contract = new ethers_1.ethers.Contract(deployAddress, Healthcare_json_1.default.abi, signer);
            const response = yield (0, index_1.createHospital)({
                name: hospitalDetails.name,
                email: hospitalDetails.email,
                image: hospitalDetails.image,
                location: hospitalDetails.location,
                walletAddress: hospitalDetails.walletAddress,
                description: hospitalDetails.description,
                telephone: hospitalDetails.phone
            });
            const allowHospital = yield contract.makeThisAddressHospital();
            sweetalert2_1.default.fire({
                position: 'top-end',
                icon: 'success',
                title: 'You Successfully add your Hospital',
                showConfirmButton: false,
                timer: 1500
            });
            const id = response.data.data.hospital._id;
            const address = yield signer.getAddress();
            window.location.replace(`/components/Hospital/${address}`);
        }
        catch (error) {
            console.log(error);
            sweetalert2_1.default.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${error.response.data.message}`
            });
        }
    });
    (0, react_1.useEffect)(() => {
        fetch();
    }, []);
    const styles = {
        main: `w-full h-screen flex justify-around items-center`,
        left_container: `w-5/12 h-5/6 flex flex-col justify-between items-start ml-20`,
        img_container: `border-2 w-6/12 h-3/6 drop-shadow-2.5xl ml-10`,
        txt_container: `w-11/12 h-1/6 flex flex-col justify-end`,
        txt_up: `text-2xl ml-16`,
        txt: `text-2xl ml-5`,
        btn_container: `w-11/12 h-1/6`,
        btn_bg: `w-48 h-10 bg-light-sky border-2 drop-shadow-2xl ml-20 p-1 active:drop-shadow-xl active:bg-ocen_blue p-2`,
        right_container: `w-4/12 h-5/6 mr-20`,
        main_box: `bg-dark_pink w-full h-full drop-shadow-3xl border-4 flex flex-col justify-around p-10`,
        input_bg: `h-12 mt-3 mb-3 flex justify-between`,
        large_input_bg: `h-32 mt-5 mb-5`,
        small_input_box: `bg-white border-2 drop-shadow-2xl w-5/12 h-full`,
        l_small_input_box: `bg-ocen_blue border-2 drop-shadow-2xl w-full p-2 h-12 ml-auto cursor-pointer active:drop-shadow-xl active:mt-2`,
        connect_wallet: `bg-high_contrast_yellow border-2 drop-shadow-2xl w-5/12 h-full flex flex-col justify-center items-center active:mt-2 active:drop-shadow-xl active:bg-grinish-yellow`,
        signup: `bg-light-sky border-2 drop-shadow-2xl w-5/12 h-10 mx-auto active:mt-2 active:drop-shadow-xl active:bg-ocen_blue pl-4 pt-1`,
        large_input_box: `bg-white border-2 drop-shadow-2xl w-full h-full`,
    };
    return (<div className={styles.main}>
      <div className={styles.left_container}>
        <div className={styles.img_container}>
          <img src="/images/hos2.png" alt="" className='w-full h-full'/>
        </div>
        <div className={styles.txt_container}>
        <react_type_animation_1.TypeAnimation sequence={[
            `Let's fix the Healthcare sectors by adding Hospitals into Blockchain`,
            1000,
            `Unleashing the Power of Blockchain in Healthcare: Transforming Hospitals for Improved Patient Outcomes.`,
            1000,
            `Revolutionizing Healthcare through the integration of Hospitals and Blockchain technology, creating a secure and efficient system for all`,
            1000
        ]} speed={70} deletionSpeed={99} className={styles.txt} wrapper="span" repeat={Infinity}/>
          
        </div>
        <div className={styles.btn_container}>
          <link_1.default href={"/components/DoctorDetails"} className={styles.btn_bg}>
            <span className='text-xl'>Doctor dashboard</span>
          </link_1.default>
        </div>
      </div>
      <div className={styles.right_container}>
        <div className={styles.main_box}>
        <div className={styles.input_bg}>
          <div className={styles.small_input_box}>
            <input type="text" className='w-full h-full p-2 placeholder:text-2xl' placeholder='name:' onChange={(e) => setHospitalDetails(Object.assign(Object.assign({}, hospitalDetails), { name: e.target.value }))}/>
          </div>
          <button className={styles.connect_wallet} onClick={handleConnect}>
            {connected ?
            <span>Connected</span> :
            <span>Connect Wallet</span>}
          </button>
        </div>
        <div className={styles.input_bg}>
          <div className={styles.large_input_box}>
            <input type="email" className='w-full h-full p-2 placeholder:text-2xl' placeholder='email:' onChange={(e) => setHospitalDetails(Object.assign(Object.assign({}, hospitalDetails), { email: e.target.value }))}/>
          </div>
        </div>

        <div className={styles.large_input_bg}>
          <div className={styles.large_input_box}>
            <textarea name="" className='w-full h-full p-2 placeholder:text-2xl' placeholder='description:' cols={30} rows={10} onChange={(e) => setHospitalDetails(Object.assign(Object.assign({}, hospitalDetails), { description: e.target.value }))}></textarea>
          </div>
        </div>

        <div className={styles.input_bg}>
          <div className="flex items-center">
            <label className={styles.l_small_input_box}>
              <span>{uploaded ? `Uploaded` : `Upload Image`}</span>
              <input type="file" ref={inputRef} onChange={uploadFile} className="hidden"/>
            </label>
            <span className="ml-3 text-gray-600">{filename}</span>
          </div>
        </div>
        <div className={styles.input_bg}>
          <div className={styles.large_input_box}>
            <input type="text" className='w-full h-full p-2 placeholder:text-2xl' placeholder='location:' onChange={(e) => setHospitalDetails(Object.assign(Object.assign({}, hospitalDetails), { location: e.target.value }))}/>
          </div>
        </div>
        <div className={styles.input_bg}>
          <div className={styles.large_input_box}>
            <input type="tel" className='w-full h-full p-2 placeholder:text-2xl' placeholder='phone:' onChange={(e) => setHospitalDetails(Object.assign(Object.assign({}, hospitalDetails), { phone: [e.target.value] }))}/>
          </div>
        </div>
        
        <div className={styles.input_bg}>
          <button className={styles.signup} onClick={handleSubmit}>
            <span>{`Add Hospital +`}</span>
          </button>
        </div>
      </div>
      </div>
    </div>);
}
exports.default = AddHospital;
