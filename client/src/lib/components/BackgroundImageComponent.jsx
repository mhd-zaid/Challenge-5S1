import PropTypes from 'prop-types';

const BackgroundImage = ({ children, imageUrl, childClassName }) => {
    return (
        <div style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            top: 60,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
        }}>
            <div className={childClassName}>
                {children}
            </div>
        </div>
    );
};

BackgroundImage.propTypes = {
    children: PropTypes.node.isRequired,
    imageUrl: PropTypes.string.isRequired,
    childClassName: PropTypes.string,
};

BackgroundImage.defaultProps = {
    childClassName: '',
};

export default BackgroundImage;