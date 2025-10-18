export const getStatusStyle = (status) => {
  const styles = {
    delivered: { color: "#28A745", fontWeight: "bold" },
    pending: { color: "#007BFF", fontWeight: "bold" },
    canceled: { color: "#DC3545", fontWeight: "bold" },
  };
  return styles[status] || { color: "#333" };
};

export const getStatusText = (status, t) => {
  const statusMap = {
    delivered: t("sales.delivered") || "Delivered",
    pending: t("sales.pending") || "Pending",
    canceled: t("sales.canceled") || "Canceled",
  };
  return statusMap[status] || status || "N/A";
};

export const formatDate = (dateString) => {
  try {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  } catch {
    return "N/A";
  }
};

