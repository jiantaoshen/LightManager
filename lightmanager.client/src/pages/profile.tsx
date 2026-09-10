/**
 * File: pages/profile.tsx
 * Purpose: Lets authenticated users view account details, update their display name, and change their password.
 * Component: ProfilePage.
 * Functions: saveName, savePassword.
 */

import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/useAuth";
import { STORAGE_KEYS } from "../lib/storage";
import { changePassword, getProfile, updateUsername, type ProfileResponse } from "../services/userService";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [userName, setUserName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();

  useEffect(() => {
    void getProfile()
      .then((data) => {
        setProfile(data);
        setUserName(data.userName);
      })
      .catch(console.error);
  }, []);

  const saveName = async () => {
    if (!profile || !user) return;

    setLoading(true);
    setMessage(null);

    try {
      await updateUsername({ fullName: userName });
      const updated = { ...user, fullName: userName };
      setUser(updated);
      localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(updated));
      setMessage("Name updated.");
    } catch {
      setMessage("Could not update your name.");
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password changed.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Password change failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <p className="rounded-lg border border-border bg-muted/50 p-3 text-sm">{message}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your basic account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.email ?? ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={userName} onChange={(event) => setUserName(event.target.value)} />
            </div>
            <Button onClick={() => void saveName()} disabled={loading}>
              Save changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Use a strong password you do not reuse elsewhere.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>New password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => void savePassword()}
              disabled={loading || !currentPassword || !newPassword}
            >
              Change password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
