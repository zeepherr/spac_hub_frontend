function updateMessagesWithNewMessage(oldData, message) {
  if (!oldData?.pages?.length) {
    return oldData;
  }
  const alreadyExists = oldData.pages.some((page) =>
    page.messages.some((item) => String(item.id) === String(message.id)),
  );
  if (alreadyExists) {
    return oldData;
  }
  return {
    ...oldData,
    pages: oldData.pages.map((page, index) =>
      index === 0
        ? { ...page, messages: [...page.messages, message] }
        : page,
    ),
  };
}

function updateMessagesWithReadReceipt(oldData, readData) {
  if (!oldData?.pages?.length) {
    return oldData;
  }
  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      messages: page.messages.map((message) => {
        const shouldMarkRead =
          String(message.senderId) !== String(readData.readerId) &&
          !message.readAt;
        return shouldMarkRead
          ? { ...message, readAt: readData.readAt }
          : message;
      }),
    })),
  };
}

export { updateMessagesWithNewMessage, updateMessagesWithReadReceipt };
