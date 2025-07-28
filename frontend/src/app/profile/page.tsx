"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BACKEND } from "~/constants/env";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Header from "~/components/Header";
import PageContainer from "~/components/ui/PageContainer";
import Card from "~/components/ui/Card";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import LoadingSpinner from "~/components/ui/LoadingSpinner";

export default function Profile() {
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notyf, setNotyf] = useState<Notyf | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    setNotyf(new Notyf({}));
  }, []);

  useEffect(() => {
    if (user && usernameRef.current && emailRef.current) {
      usernameRef.current.value = (user as any).username || "";
      emailRef.current.value = (user as any).email || "";
    }
  }, [user]);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(`${BACKEND}/api/auth/verify`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          router.push("/login");
          return;
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        router.push("/login");
        return;
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;

    if (!username || !email) {
      if (notyf) {
        notyf.error("Please fill in all fields.");
      }
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const response = await fetch(`${BACKEND}/api/auth/updateProfile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (notyf) {
          notyf.success("Profile updated successfully!");
        }
      } else {
        const errorData = await response.json();
        if (notyf) {
          notyf.error(errorData.error);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (notyf) {
        notyf.error("Internal server error");
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPassword = currentPasswordRef.current?.value;
    const newPassword = newPasswordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      if (notyf) {
        notyf.error("Please fill in all password fields.");
      }
      return;
    }

    if (newPassword !== confirmPassword) {
      if (notyf) {
        notyf.error("New passwords do not match.");
      }
      return;
    }

    if (newPassword.length < 6) {
      if (notyf) {
        notyf.error("New password must be at least 6 characters long.");
      }
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch(`${BACKEND}/api/auth/changePassword`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        if (notyf) {
          notyf.success("Password changed successfully!");
        }
        if (currentPasswordRef.current) currentPasswordRef.current.value = "";
        if (newPasswordRef.current) newPasswordRef.current.value = "";
        if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
      } else {
        const errorData = await response.json();
        if (notyf) {
          notyf.error(errorData.error);
        }
      }
    } catch (error) {
      console.error("Error changing password:", error);
      if (notyf) {
        notyf.error("Internal server error");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND}/api/auth/logout`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      router.push("/login");
    }
  };

  if (isLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <Header user={user} />
      
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile Settings</h1>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Update Profile</h2>
              <Input
                label="Username"
                type="text"
                id="username"
                ref={usernameRef}
              />
              <Input
                label="Email"
                type="email"
                id="email"
                ref={emailRef}
              />
              <Button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              >
                {isUpdatingProfile ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Change Password</h2>
              <Input
                label="Current Password"
                type="password"
                id="currentPassword"
                ref={currentPasswordRef}
              />
              <Input
                label="New Password"
                type="password"
                id="newPassword"
                ref={newPasswordRef}
              />
              <Input
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                ref={confirmPasswordRef}
              />
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Actions</h2>
            <Button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
            >
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
