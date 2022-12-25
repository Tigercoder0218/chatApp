import { toast } from 'react-toastify';
import { MdDevices } from "react-icons/md";

const PWA = () => {
    let deferredPrompt;

    //Install PWA triggered by Toast
    const InstallPWA = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log("PWA Install: ", outcome)
            deferredPrompt = null;
        } else {
            alert("Prompt Failed");
        }
    }

    const Msg = ({ closeToast, toastProps }) => (
        <div className="PWAContainer flex">
            Install PWA App
            <button className='PWABtn flex' onClick={InstallPWA}>
                <MdDevices color='inherit' size={25} />
                <span>Install</span>
            </button>
        </div>
    );

    //Before Install Prompt: Show Toast
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        toast(<Msg />, {
            toastId: "PWAInstall",
            position: "bottom-center",
            autoClose: 3000,
        })
    });

    //Show Toast after Install
    window.addEventListener("appinstalled", () => {
        deferredPrompt = null;
        console.log("PWA was installed");
        toast.success("PWA installed 👍", {
            toastId: "PWA",
            position: "top-right",
            autoClose: 3000,
        });
    });
}

export default PWA