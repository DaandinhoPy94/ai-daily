import SwiftUI

struct CommentRow: View {
    let comment: Comment
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .top, spacing: 12) {
                // Avatar
                if let avatarURL = comment.userAvatarURL, let url = URL(string: avatarURL) {
                    AsyncImage(url: url) { image in
                        image.resizable()
                             .scaledToFill()
                    } placeholder: {
                        Color.gray.opacity(0.3)
                    }
                    .frame(width: 32, height: 32)
                    .clipShape(Circle())
                } else {
                    Circle()
                        .fill(Color.brandTeal.opacity(0.1))
                        .frame(width: 32, height: 32)
                        .overlay(
                            Text(String(comment.userName.prefix(1)))
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundStyle(Color.brandTeal)
                        )
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(comment.userName)
                            .font(.subheadline)
                            .fontWeight(.semibold)
                        
                        Spacer()
                        
                        Text(comment.timeAgo)
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    
                    Text(comment.content)
                        .font(.callout)
                        .foregroundStyle(.primary)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
        .padding(.vertical, 8)
    }
}
