import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff8e1',  // Màu nền sáng ấm áp
    paddingTop: 16,  // Add some padding to the top
  },
  ratingSection: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    marginTop: 20,
  },
  ratingTitle: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  ratingInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 4,
  },
  ratingContentInput: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 4,
  },
  ratingButton: {
    marginTop: 16,
    borderRadius: 5,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentSection: {
    marginVertical: 10,
  },
  commentInput: {
    marginBottom: 10,
    backgroundColor: '#fff3e0',  // Màu nền cho input
  },
  commentButton: {
    marginBottom: 10,
    backgroundColor: '#ff7043',  // Màu nút bấm sáng
  },
  commentsContainer: {
    marginVertical: 10,
  },
  commentCard: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff8e1',  // Màu nền cho thẻ comment
  },
  commentContent: {
    flexDirection: 'row',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: 'bold',
    color: '#ff7043',  // Màu sắc tên người dùng
  },
  commentText: {
    fontSize: 16,
    color: '#333',  // Màu sắc văn bản bình luận
  },
  commentDate: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
  noComments: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  acceptButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#66bb6a',  // Màu nút chấp nhận tham gia
  },
  acceptedChip: {
    marginTop: 10,
    backgroundColor: '#4caf50',  // Màu chip được chấp nhận
  },
  commentsClosedMessage: {
    color: '#ff7043',  // Màu thông báo bình luận đóng
    fontStyle: 'italic',
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff8e1',  // Màu nền cho thẻ
  },
  image: {
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    color: '#ff7043',  // Màu sắc tên người dùng
  },
  time: {
    color: '#777',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#ff7043',  // Màu tiêu đề
  },
  placeVisitsContainer: {
    marginTop: 20,
  },
  placeVisitCard: {
    marginBottom: 10,
    backgroundColor: '#fff3e0',  // Màu nền cho thẻ địa điểm
  },
  placeVisitName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeVisitDescription: {
    fontSize: 14,
    color: '#555',
  },
  placeVisitLocation: {
    fontSize: 12,
    color: '#333',
  },
  placeVisitAddress: {
    fontSize: 12,
    color: '#333',
  },
  noPlaceVisits: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
  },
  imagesContainer: {
    marginTop: 20,
  },
  imageCard: {
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButton: {
    marginVertical: 10,
    backgroundColor: '#ff7043',  // Màu nút bấm trong modal
  },
  buttonText: {
    color: 'white',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#7B61FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardContent: {
    flexDirection: 'row',
  },
  addButton: {
    marginTop: 10,
        marginBottom: 10,

    paddingHorizontal: 5,  // Adjusted to make the button narrower
    paddingVertical: 1,    // Adjusted to make the button shorter
    backgroundColor: '#ff7043',
    borderRadius: 5,
    alignSelf: 'flex-start', // Align button to the start of the container
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,          // Adjusted font size to match button size
    color: '#ffffff',      // Ensure text is readable
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6A1B9A',  // Dark purple text
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6A1B9A',  // Dark purple text
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#6A1B9A',  // Dark purple text
  },
  updateButton: {
    marginTop: 8,
  },
});

export default styles;
