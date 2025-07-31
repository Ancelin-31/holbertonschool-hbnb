from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services import facade


api = Namespace('reviews', description='Review operations')

# Define the review model for input validation and documentation
review_model = api.model('Review', {
    'text': fields.String(required=True, description='Text of the review'),
    'rating': fields.Integer(required=True, description='Rating of the place (1-5)'),
    'user_id': fields.String(required=True, description='ID of the user'),
    'place_id': fields.String(required=True, description='ID of the place')
})

@api.route('/')
class ReviewList(Resource):
    @api.expect(review_model)
    @api.doc(security='Bearer')
    @api.response(201, 'Review successfully created')
    @api.response(400, 'Invalid input data')
    @jwt_required()
    def post(self):
        """Register a new review"""
        review_data = api.payload
        current_user = get_jwt_identity()

        user_id = current_user.get('id')
        if not user_id:
            return {'error': 'User not authenticated properly'}, 401

        review_data['user_id'] = user_id

        place_id = review_data.get('place_id')
        if not place_id:
            return {'error': 'place_id is required'}, 400

        place = facade.get_place(place_id)
        if not place:
            return {'error': 'Place not found'}, 404

        if place.owner_id == user_id:
            return {'error': 'You cannot review your own place.'}, 400


        for review in place.reviews:
            if review.user_id == user_id:
                return {'error': 'You have already reviewed this place'}, 400

        try:
            new_review = facade.create_review(review_data)
        except ValueError as e:
            return {'error': str(e)}, 400


        if not new_review:
            return {'error': 'Invalid input data'}, 400

        return new_review.to_dict(), 201


    @api.response(200, 'List of reviews retrieved successfully')
    def get(self):
        """Retrieve a list of all reviews"""
        all_reviews = facade.get_all_reviews()
        return [review.to_dict() for review in all_reviews], 200

@api.route('/<review_id>')
class ReviewResource(Resource):
    @api.doc(security='Bearer')
    @api.response(200, 'Review details retrieved successfully')
    @api.response(404, 'Review not found')
    def get(self, review_id):
        """Get review details by ID"""
        review = facade.get_review(review_id)

        if not review:
            return {'error': 'Review not found'}, 404

        return review.to_dict(), 200

    @api.expect(review_model, validate=True)
    @api.response(200, 'Review updated successfully')
    @api.response(404, 'Review not found')
    @api.response(400, 'Invalid input data')
    @jwt_required()
    def put(self, review_id):
        """Update a review's information"""
        review_data = api.payload
        user = review_data.get('user_id')
        current_user = get_jwt_identity()

        if not user:
            return {'error': 'User not found'}, 404
        if user != current_user['id']:
            return {'error': 'Unauthorized action.'}, 403

        try:
            updated_review = facade.update_review(review_id, review_data)
        except Exception as e:
            return {'error': str(e)}, 400

        if not updated_review:
            return {'error': 'Review not found'}, 404
        
        return updated_review.to_dict(), 200

    @api.response(200, 'Review deleted successfully')
    @api.response(404, 'Review not found')
    @jwt_required()
    def delete(self, review_id):
        """Delete a review"""
        current_user = get_jwt_identity()
        review = facade.get_review(review_id)

        if not review:
            return {'error': 'Review not found'}, 404

        if review.user_id != current_user['id']:
            return {'error': 'Unauthorized action.'}, 403

        facade.delete_review(review_id)
        return {'message': 'Review deleted successfully'}, 200

@api.route('/places/<string:place_id>/reviews')
class PlaceReviewList(Resource):
    @api.response(200, 'List of reviews for the place retrieved successfully')
    @api.response(404, 'Place not found')
    def get(self, place_id):
        """Get all reviews for a specific place"""
        place = facade.get_place(place_id)

        if not place:
            return {'error': 'Place not found'}, 404

        all_reviews = facade.get_reviews_by_place(place_id)
        return [review.to_dict() for review in all_reviews], 200
