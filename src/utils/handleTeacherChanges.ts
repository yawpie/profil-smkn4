import { Teacher, TeachersApiEnvelope } from "@/types/Teacher";
import { apiDelete, ApiError, apiPost, apiPut } from "./apiClient";
import { Notification } from "@/types/Notification";

export const handleSaveTeacher = async (
  newTeacher: Teacher,
  setNotification?: (notification: Notification | null) => void,
  setLoading?: (loading: boolean) => void
) => {
  if (setLoading) setLoading(true);
  try {
    const formData = new FormData();
    formData.append("name", newTeacher.name);
    // Backend expects 'jabatan' for position
    formData.append("jabatan", newTeacher.position);
    if (newTeacher.nip) {
      formData.append("nip", newTeacher.nip);
    }
    if (newTeacher.imageFile) {
      formData.append("image", newTeacher.imageFile);
    }
    if (newTeacher.subject) {
      formData.append("mata_pelajaran", newTeacher.subject);
    }
    // If subject is distinct from jabatan and backend supports it, you could
    // append it as an extra field here. For now, subject is mapped from jabatan.
    if (newTeacher.major_id) {
      formData.append("major_id", newTeacher.major_id);
    }

    // Image handling: if the form has set an image as a File in a future
    // enhancement, it should be appended here. Currently Teacher only
    // exposes image as string URL/base64, so we only send image when it
    // represents a File in the calling code.

    if (newTeacher.id) {
      await apiPut<TeachersApiEnvelope, FormData>(
        `/teachers?id=${newTeacher.id}`,
        formData
      );
    } else {
      await apiPost<TeachersApiEnvelope, FormData>("/teachers", formData);
    }
    if (setNotification) {
      setNotification({
        message: `Data guru berhasil ${
          newTeacher.id ? "diperbarui" : "ditambahkan"
        }!`,
        type: "success",
      });
    }
  } catch (e: unknown) {
    console.error("Failed to save teacher:", e);
    if (setNotification) {
      if ((e as ApiError)?.status === 413) {
        setNotification({
          message:
            "Gagal menyimpan guru. Ukuran gambar terlalu besar. Silakan pilih gambar yang lebih kecil.",
          type: "error",
        });
      } else if ((e as ApiError)?.message) {
        setNotification({
          message: `Gagal menyimpan guru: ${(e as ApiError).message}`,
          type: "error",
        });
      } else if (e instanceof Error) {
        setNotification({
          message: `Gagal menyimpan guru: ${e.message}`,
          type: "error",
        });
      } else {
        setNotification({
          message: "Gagal menyimpan guru. Silakan coba lagi.",
          type: "error",
        });
      }
    }
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const handleDeleteTeacher = async (
  id: string,
  setNotification?: (notification: Notification | null) => void,
  setLoading?: (loading: boolean) => void
) => {
  if (confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
    if (setLoading) setLoading(true);
    try {
      await apiDelete<{ message: string }>(`/teachers?id=${id}`);
      if (setNotification) {
        setNotification({
          message: "Data guru berhasil dihapus!",
          type: "success",
        });
      }
      // setCurrentPage(1); // Reset to first page
      // fetchTeachersAndMajors();
    } catch (e: unknown) {
      console.error("Failed to delete teacher:", e);
      if (setNotification) {
        if ((e as ApiError)?.message) {
          setNotification({
            message: `Gagal menghapus guru: ${(e as ApiError).message}`,
            type: "error",
          });
        } else if (e instanceof Error) {
          setNotification({
            message: `Gagal menghapus guru: ${e.message}`,
            type: "error",
          });
        } else {
          setNotification({
            message: "Gagal menghapus guru. Silakan coba lagi.",
            type: "error",
          });
        }
      }
    } finally {
      if (setLoading) setLoading(false);
    }
  }
};
