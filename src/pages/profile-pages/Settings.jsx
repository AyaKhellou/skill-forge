import { useEffect, useRef, useState } from "react";
import { Camera, CircleAlert, Moon, Pen, Sun, X } from "lucide-react";
import Button from "../../components/Button";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import useProfileInfo from "../../hooks/useProfileInfo";
import { deleteWarning, uploadImage } from "../../services/function";

export default function Settings() {
    const {
        profileInfo,
        error,
        loadingProfile,
        updateUserDetails,
        updateUserProfile,
        isUpdating,
        deleteUserAccount,
    } = useProfileInfo();

    const [editNameMode, setEditNameMode] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [changeImageMode, setChangeImageMode] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [saveError, setSaveError] = useState(null);
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (editNameMode) {
            nameInputRef.current?.focus();
        }
    }, [editNameMode]);

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setChangeImageMode(true);
            setSaveError(null);
        }
    };

    async function saveChanges() {
        setSaveError(null);

        if (editNameMode && !nameInput.trim()) {
            setSaveError("Your name cannot be empty.");
            return;
        }

        try {
            if (editNameMode && nameInput.trim() !== profileInfo?.name) {
                const updatedName = nameInput.trim();
                await updateUserDetails({ name: updatedName });
                await updateUserProfile({ displayName: updatedName });
                setEditNameMode(false);
            }

            if (imageFile) {
                const newImageUrl = await uploadImage(imageFile);
                await updateUserDetails({ pfp: newImageUrl });
                await updateUserProfile({ photoURL: newImageUrl });
                setChangeImageMode(false);
                setImageFile(null);
                setImagePreview(null);
            }
        } catch (error) {
            setSaveError(error.message || "Unable to save your changes. Please try again.");
        }
    }

    function cancelNameEdit() {
        setNameInput(profileInfo?.name || "");
        setEditNameMode(false);
    }

    async function deleteUser() {
        const confirmed = await deleteWarning(
            ", Are you sure you want to delete your account?",
        );
        if (!confirmed) return;

        try {
            await deleteUserAccount();
        } catch (error) {
            console.error("Error deleting user account:", error);
        }
    }

    if (loadingProfile) {
        return (
            <section className="page flex items-center justify-center">
                <Loader />
            </section>
        );
    }

    if (error) {
        return (
            <section className="page flex items-center justify-center">
                <ErrorMessage
                    message={`Unable to load your settings. ${error.message || "Please try again."}`}
                />
            </section>
        );
    }

    if (!profileInfo) {
        return (
            <section className="page flex items-center justify-center">
                <ErrorMessage message="Profile information is unavailable." />
            </section>
        );
    }

    return (
        <section className="page">
            <div className="bg-card-background shadow rounded p-section flex flex-col gap-4 items-center">
                <div className="relative rounded-[50%] mb-3 w-16 h-16 flex items-center justify-center bg-accent cursor-pointer overflow-hidden">
                    <input
                        type="file"
                        id="image-upload"
                        name="imageUpload"
                        accept="image/*"
                        className="peer sr-only"
                        onChange={handleImageChange}
                    />
                    <label
                        htmlFor="image-upload"
                        className="absolute inset-0 bg-gray-950/40 opacity-0 hover:opacity-100 peer-focus-visible:opacity-100 w-full h-full flex items-center justify-center cursor-pointer"
                    >
                        <Camera width={24} height={24} aria-hidden="true" />
                        <span className="sr-only">Change profile photo</span>
                    </label>
                    {imagePreview || profileInfo.pfp ? (
                        <img
                            src={imagePreview || profileInfo.pfp}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span aria-hidden="true" className="bg-accent">
                            {profileInfo.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 justify-center">
                    {editNameMode ? (
                        <div className="flex items-center gap-2">
                            <input
                                aria-label="Display name"
                                className="text-xl font-bold text-text w-fit"
                                ref={nameInputRef}
                                type="text"
                                value={nameInput}
                                onChange={(event) => setNameInput(event.target.value)}
                            />
                            <button
                                type="button"
                                className="cursor-pointer self-start"
                                aria-label="Cancel name edit"
                                onClick={cancelNameEdit}
                            >
                                <X width={17} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h3>{profileInfo.name}</h3>
                            <button
                                type="button"
                                className="cursor-pointer self-start"
                                aria-label="Edit display name"
                                onClick={() => {
                                    setNameInput(profileInfo.name || "");
                                    setEditNameMode(true);
                                }}
                            >
                                <Pen width={17} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="w-full flex flex-col gap-4">
                    <div className="bg-background shadow rounded flex flex-wrap items-center justify-between gap-2 p-3">
                        <p className="detail">Email</p>
                        <p>{profileInfo.email || "Not provided"}</p>
                    </div>

                    <div className="bg-background shadow rounded flex flex-wrap items-center justify-between gap-2 p-3">
                        <p className="detail">Mode</p>
                        <div className="flex gap-4">
                            <p>{profileInfo.mode || "light mode"}</p>
                            {profileInfo.mode === "dark mode" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
                        </div>
                    </div>

                    <div className="bg-background shadow rounded flex flex-wrap items-center justify-between gap-2 p-3">
                        <p className="detail">Delete account</p>
                        <button
                            type="button"
                            className="text-red flex items-center justify-center gap-2 cursor-pointer"
                            onClick={deleteUser}
                        >
                            Delete
                            <CircleAlert className="text-red!" width={17} height={17} aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {saveError && <ErrorMessage message={saveError} />}

                <Button
                    classes="self-end"
                    onClick={saveChanges}
                    disabled={isUpdating || (!editNameMode && !changeImageMode)}
                >
                    {isUpdating ? "Saving..." : "Save changes"}
                </Button>
            </div>
        </section>
    );
}